import { useState, useRef, useEffect, useCallback } from 'react';

export interface CapturedFrame {
  dataUrl: string;
  file: File;
}

export interface UseCameraScannerReturn {
  isCameraActive: boolean;
  cameraError: string | null;
  facingMode: 'environment' | 'user';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startCamera: (mode?: 'environment' | 'user') => Promise<boolean>;
  stopCamera: () => void;
  toggleFacingMode: () => Promise<void>;
  captureFrame: (filenamePrefix?: string) => CapturedFrame | null;
  clearError: () => void;
}

export function useCameraScanner(): UseCameraScannerReturn {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping video track:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(
    async (mode: 'environment' | 'user' = facingMode): Promise<boolean> => {
      setCameraError(null);
      stopCamera();

      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported or permitted in this browser context. Please use image upload.');
        return false;
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('Video auto-play delayed or interrupted:', playErr);
          }
        }

        setFacingMode(mode);
        setIsCameraActive(true);
        return true;
      } catch (err: any) {
        console.error('Camera initialization failure:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. Please allow camera access in your browser settings or upload an image.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device. Please connect an optical sensor or upload a leaf photo.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError('Camera is currently locked by another application. Please close other camera tabs and try again.');
        } else {
          setCameraError(`Camera error: ${err.message || 'Unable to stream optical sensor.'}`);
        }
        setIsCameraActive(false);
        return false;
      }
    },
    [facingMode, stopCamera]
  );

  const toggleFacingMode = useCallback(async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCamera(nextMode);
  }, [facingMode, startCamera]);

  const captureFrame = useCallback(
    (filenamePrefix: string = 'leaf_scan'): CapturedFrame | null => {
      const video = videoRef.current;
      if (!video) return null;

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw the current video frame into the canvas
      ctx.drawImage(video, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      // Convert dataUrl to native File for API transmission
      try {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], `${filenamePrefix}_${Date.now()}.jpg`, { type: mimeString });

        stopCamera();
        return { dataUrl, file };
      } catch (convErr) {
        console.error('Frame conversion error:', convErr);
        stopCamera();
        return null;
      }
    },
    [stopCamera]
  );

  // Clean up stream tracks on unmount to avoid background camera activity
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {
            // ignore cleanup errors
          }
        });
      }
    };
  }, []);

  return {
    isCameraActive,
    cameraError,
    facingMode,
    videoRef,
    startCamera,
    stopCamera,
    toggleFacingMode,
    captureFrame,
    clearError: () => setCameraError(null),
  };
}
