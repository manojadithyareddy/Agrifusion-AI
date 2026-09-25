/**
 * AgriFusion AI — Hardware & Graphics Capability Detector
 * Ensures 3D experiences run at 60 FPS on high-end hardware while
 * automatically and gracefully degrading to 2D/Canvas/Gradient on low-power,
 * mobile, or reduced-motion environments.
 */

export interface DeviceTier {
  isMobile: boolean;
  isTablet: boolean;
  hasWebGL: boolean;
  hasWebGL2: boolean;
  prefersReducedMotion: boolean;
  tier: 'high' | 'medium' | 'low';
  gpuRenderer?: string;
  recommendedParticles: number;
  enablePostProcessing: boolean;
  pixelRatio: number;
}

export function detectDeviceCapabilities(): DeviceTier {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      hasWebGL: false,
      hasWebGL2: false,
      prefersReducedMotion: false,
      tier: 'medium',
      recommendedParticles: 300,
      enablePostProcessing: false,
      pixelRatio: 1,
    };
  }

  // 1. Check user preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. User-agent & screen checks
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua) || window.innerWidth < 768;
  const isTablet = /ipad|tablet/i.test(ua) || (window.innerWidth >= 768 && window.innerWidth < 1024);

  // 3. WebGL probe
  let hasWebGL = false;
  let hasWebGL2 = false;
  let gpuRenderer = 'unknown';

  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      hasWebGL2 = true;
      hasWebGL = true;
    } else {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) hasWebGL = true;
    }

    if (hasWebGL) {
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'generic';
        }
      }
    }
  } catch {
    hasWebGL = false;
  }

  // 4. Determine performance tier
  let tier: 'high' | 'medium' | 'low' = 'high';

  if (!hasWebGL || prefersReducedMotion) {
    tier = 'low';
  } else if (isMobile) {
    tier = 'low';
  } else if (isTablet) {
    tier = 'medium';
  } else {
    // Check if integrated graphics or software renderer
    const lowerGpu = gpuRenderer.toLowerCase();
    if (
      lowerGpu.includes('swiftshader') ||
      lowerGpu.includes('llvmpipe') ||
      lowerGpu.includes('basic render') ||
      lowerGpu.includes('intel hd 3000') ||
      lowerGpu.includes('mali-400')
    ) {
      tier = 'low';
    } else if (
      lowerGpu.includes('intel') ||
      lowerGpu.includes('adreno 5') ||
      lowerGpu.includes('mali-g5')
    ) {
      tier = 'medium';
    } else {
      tier = 'high';
    }
  }

  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const pixelRatio = tier === 'high' ? Math.min(devicePixelRatio, 1.75) : Math.min(devicePixelRatio, 1.2);

  const recommendedParticles = tier === 'high' ? 800 : tier === 'medium' ? 350 : 80;

  return {
    isMobile,
    isTablet,
    hasWebGL,
    hasWebGL2,
    prefersReducedMotion,
    tier,
    gpuRenderer,
    recommendedParticles,
    enablePostProcessing: tier === 'high' && !isMobile,
    pixelRatio,
  };
}
