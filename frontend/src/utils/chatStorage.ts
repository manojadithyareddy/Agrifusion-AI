/**
 * AgriFusion AI — Chat Persistence & Conversation History Engine
 * ==============================================================
 * Provides robust multi-conversation persistence for authenticated farmers and guest users.
 * 
 * Features:
 * - Conversation lifecycle management (Create, Load, Save, Archive, New Chat)
 * - Persists message history including full OpenCV diagnosis, evidence, and thumbnail previews
 * - Safe base64 image caching to ensure pasted/uploaded images survive browser refresh (F5)
 * - User-scoped keys ensuring history is isolated per authenticated account
 * - Zero empty-chat flicker on mount/refresh
 */

import type { AssistantDiagnosisResult } from './localAssistantVisionEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text?: string;
  images?: string[];
  videos?: string[];
  documents?: Array<{ name: string; size: string; text?: string; url?: string }>;
  diagnosis?: AssistantDiagnosisResult;
  isAnalyzing?: boolean;
  analyzingStage?: string;
  analyzingProgress?: number;
  analyzingRemainingSeconds?: number;
  activeTreatmentTab?: 'cultural' | 'chemical' | 'safety';
  showEvidenceOverlay?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  lastCrop?: string;
  lastCondition?: string;
}

const CONV_LIST_PREFIX = 'agrifusion_conv_list_';
const ACTIVE_CONV_PREFIX = 'agrifusion_active_conv_';
const CONV_MSG_PREFIX = 'agrifusion_conv_msg_';

export function getUserScope(userId?: string | null): string {
  if (!userId || userId === 'null' || userId === 'undefined') return 'guest';
  return userId;
}

export function createWelcomeMessage(isHi: boolean): ChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    sender: 'assistant',
    timestamp: 'Just now',
    text: isHi
      ? 'नमस्ते किसान मित्र! 👋 मैं आपका एग्रीफ्यूजन एआई कृषि विशेषज्ञ हूँ।\n\nआप किसी भी फसल की **फोटो (Image)**, खेत का **वीडियो (Video)**, या **मृदा स्वास्थ्य कार्ड / लैब रिपोर्ट (Soil Health Document)** अपलोड कर सकते हैं। आप सीधे गूगल या किसी अन्य जगह से इमेज कॉपी करके **Ctrl+V** से पेस्ट भी कर सकते हैं!\n\nहमारा 28-सेकंड डीप विज़न व ICAR RAG इंजन आपको 37 फसलों के लिए 100% सटीक व वैज्ञानिक समाधान प्रदान करेगा! 🌾'
      : 'Hello Farmer Friend! 👋 I am your AgriFusion AI Agricultural Advisor.\n\nYou can upload a **Crop Photo**, paste an image with **Ctrl+V**, record/upload a **Field Video**, or attach a **Soil Health Card / Lab Document**.\n\nOur 28-second Deep Multi-Spectral Inspection & ICAR RAG Engine provides verified diagnosis across all 37 Indian crops! 🌾',
  };
}

/**
 * Get all conversation summaries for a user
 */
export function getConversationList(userId?: string | null): ConversationSummary[] {
  try {
    const scope = getUserScope(userId);
    const raw = localStorage.getItem(`${CONV_LIST_PREFIX}${scope}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[ChatStorage] Failed to read conversation list:', err);
  }
  return [];
}

/**
 * Get active conversation ID for a user
 */
export function getActiveConversationId(userId?: string | null): string | null {
  try {
    const scope = getUserScope(userId);
    return localStorage.getItem(`${ACTIVE_CONV_PREFIX}${scope}`) || null;
  } catch {
    return null;
  }
}

export interface GroupedConversations {
  today: ConversationSummary[];
  yesterday: ConversationSummary[];
  previous7Days: ConversationSummary[];
  previous30Days: ConversationSummary[];
  older: ConversationSummary[];
}

/**
 * Get all conversation summaries grouped by date categories with optional search filtering
 */
export function getGroupedConversations(
  userId?: string | null,
  searchQuery = ''
): GroupedConversations {
  let list = getConversationList(userId);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.lastCrop && c.lastCrop.toLowerCase().includes(q)) ||
        (c.lastCondition && c.lastCondition.toLowerCase().includes(q))
    );
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const startOf30Days = startOfToday - 30 * 24 * 60 * 60 * 1000;

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    older: [],
  };

  for (const conv of list) {
    const time = conv.updatedAt || conv.createdAt;
    if (time >= startOfToday) {
      grouped.today.push(conv);
    } else if (time >= startOfYesterday) {
      grouped.yesterday.push(conv);
    } else if (time >= startOf7Days) {
      grouped.previous7Days.push(conv);
    } else if (time >= startOf30Days) {
      grouped.previous30Days.push(conv);
    } else {
      grouped.older.push(conv);
    }
  }

  return grouped;
}

/**
 * Rename an existing conversation title
 */
export function renameConversation(
  convId: string,
  newTitle: string,
  userId?: string | null
): boolean {
  if (!convId || !newTitle.trim()) return false;
  try {
    const scope = getUserScope(userId);
    const list = getConversationList(scope);
    const idx = list.findIndex((c) => c.id === convId);
    if (idx >= 0) {
      list[idx].title = newTitle.trim();
      list[idx].updatedAt = Date.now();
      localStorage.setItem(`${CONV_LIST_PREFIX}${scope}`, JSON.stringify(list));
      return true;
    }
  } catch (err) {
    console.warn('[ChatStorage] Failed to rename conversation:', err);
  }
  return false;
}

/**
 * Delete a conversation and remove its messages
 */
export function deleteConversation(
  convId: string,
  userId?: string | null
): boolean {
  if (!convId) return false;
  try {
    const scope = getUserScope(userId);
    const list = getConversationList(scope);
    const updated = list.filter((c) => c.id !== convId);
    localStorage.setItem(`${CONV_LIST_PREFIX}${scope}`, JSON.stringify(updated));
    localStorage.removeItem(`${CONV_MSG_PREFIX}${convId}`);

    const activeId = getActiveConversationId(scope);
    if (activeId === convId) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id, scope);
      } else {
        localStorage.removeItem(`${ACTIVE_CONV_PREFIX}${scope}`);
      }
    }
    return true;
  } catch (err) {
    console.warn('[ChatStorage] Failed to delete conversation:', err);
  }
  return false;
}

/**
 * Load a specific conversation and set it as active
 */
export function loadConversation(
  convId: string,
  userId?: string | null
): { id: string; messages: ChatMessage[] } | null {
  const messages = loadConversationMessages(convId);
  if (messages && messages.length > 0) {
    setActiveConversationId(convId, userId);
    return { id: convId, messages };
  }
  return null;
}

/**
 * Set active conversation ID for a user
 */
export function setActiveConversationId(convId: string, userId?: string | null): void {
  try {
    const scope = getUserScope(userId);
    localStorage.setItem(`${ACTIVE_CONV_PREFIX}${scope}`, convId);
  } catch (err) {
    console.warn('[ChatStorage] Failed to set active conversation ID:', err);
  }
}

/**
 * Load all messages for a specific conversation ID
 */
export function loadConversationMessages(convId: string): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(`${CONV_MSG_PREFIX}${convId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip any dangling isAnalyzing state from interrupted sessions
        return parsed.map((m: ChatMessage) => ({
          ...m,
          isAnalyzing: false,
        }));
      }
    }
  } catch (err) {
    console.warn('[ChatStorage] Failed to load messages for conversation:', convId, err);
  }
  return null;
}

/**
 * Save messages to a conversation ID and update conversation index
 */
export function saveConversationMessages(
  convId: string,
  messages: ChatMessage[],
  userId?: string | null,
  cropHint?: string,
  conditionHint?: string
): void {
  if (!convId || !messages) return;

  try {
    const scope = getUserScope(userId);

    // Filter out temporary analyzing state for persistence
    const sanitized = messages.map((m) => {
      if (m.isAnalyzing) {
        const { isAnalyzing, analyzingStage, analyzingProgress, analyzingRemainingSeconds, ...rest } = m;
        return rest as ChatMessage;
      }
      return m;
    });

    // Save actual messages payload
    localStorage.setItem(`${CONV_MSG_PREFIX}${convId}`, JSON.stringify(sanitized));

    // Update conversation summary in list
    const list = getConversationList(userId);
    const existingIdx = list.findIndex((c) => c.id === convId);

    // Derive a meaningful conversation title
    let title = 'New Crop Advisory';
    const firstUserMsg = sanitized.find((m) => m.sender === 'user');
    if (firstUserMsg?.text && firstUserMsg.text.trim()) {
      const cleanText = firstUserMsg.text.trim();
      title = cleanText.length > 36 ? `${cleanText.substring(0, 36)}...` : cleanText;
    } else if (cropHint) {
      title = `${cropHint} Diagnosis`;
    } else if (conditionHint) {
      title = conditionHint;
    }

    const lastMsg = sanitized[sanitized.length - 1];
    const detectedCrop = cropHint || lastMsg?.diagnosis?.crop?.name;
    const detectedCond = conditionHint || lastMsg?.diagnosis?.disease?.name;

    const summary: ConversationSummary = {
      id: convId,
      title,
      createdAt: existingIdx >= 0 ? list[existingIdx].createdAt : Date.now(),
      updatedAt: Date.now(),
      messageCount: sanitized.length,
      lastCrop: detectedCrop && detectedCrop !== 'Unknown' ? detectedCrop : undefined,
      lastCondition: detectedCond && detectedCond !== 'Unknown' ? detectedCond : undefined,
    };

    if (existingIdx >= 0) {
      list[existingIdx] = summary;
    } else {
      list.unshift(summary);
    }

    // Keep at most 30 recent conversations per scope
    const trimmedList = list.slice(0, 30);
    localStorage.setItem(`${CONV_LIST_PREFIX}${scope}`, JSON.stringify(trimmedList));
  } catch (err) {
    console.warn('[ChatStorage] Failed to save conversation messages:', err);
  }
}

/**
 * Creates a brand new conversation without deleting past conversations
 */
export function createNewConversation(
  userId?: string | null,
  isHi = false
): { id: string; messages: ChatMessage[] } {
  const convId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const initialMessages: ChatMessage[] = [createWelcomeMessage(isHi)];
  
  setActiveConversationId(convId, userId);
  saveConversationMessages(convId, initialMessages, userId);

  return { id: convId, messages: initialMessages };
}

/**
 * Initialize or restore conversation on page load / refresh
 */
export function initOrRestoreConversation(
  userId?: string | null,
  isHi = false
): { id: string; messages: ChatMessage[] } {
  const scope = getUserScope(userId);
  const activeId = getActiveConversationId(scope);

  if (activeId) {
    const existingMessages = loadConversationMessages(activeId);
    if (existingMessages && existingMessages.length > 0) {
      return { id: activeId, messages: existingMessages };
    }
  }

  // Check if there are any existing conversations in list
  const list = getConversationList(scope);
  if (list.length > 0) {
    const latestConv = list[0];
    const latestMessages = loadConversationMessages(latestConv.id);
    if (latestMessages && latestMessages.length > 0) {
      setActiveConversationId(latestConv.id, scope);
      return { id: latestConv.id, messages: latestMessages };
    }
  }

  // Otherwise initialize a fresh conversation
  return createNewConversation(scope, isHi);
}

/**
 * Safely convert a File or Blob into a base64 Data URL so thumbnails survive browser refresh
 */
export async function fileToDataUrl(file: Blob, maxDimension = 640): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src || !src.startsWith('data:image')) {
        resolve(src || '');
        return;
      }

      // Resize to compact thumbnail for fast storage
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxDimension || h > maxDimension) {
            if (w > h) {
              h = Math.round((h * maxDimension) / w);
              w = maxDimension;
            } else {
              w = Math.round((w * maxDimension) / h);
              h = maxDimension;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
            return;
          }
        } catch {
          // fallback to raw base64
        }
        resolve(src);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
