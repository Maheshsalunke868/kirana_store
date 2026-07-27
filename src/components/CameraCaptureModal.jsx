import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'

  const startCamera = async () => {
    setCameraError('');
    setCapturedImage(null);

    // Stop existing stream if active
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera Access Error:', err);
      setCameraError(t('cameraPermissionError'));
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedImage(dataUrl);
    stopCamera();
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-800 space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">{t('takeCameraPhoto')}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Captured Preview */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured product" className="w-full h-full object-cover" />
          ) : cameraError ? (
            <div className="p-6 text-center text-rose-400 space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto" />
              <p className="text-xs font-bold">{cameraError}</p>
              <p className="text-[11px] text-slate-400">Please use standard file upload below instead.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Hidden Canvas for rasterization */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Facing Mode Switcher */}
          {!capturedImage && !cameraError && (
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm"
              title="Switch Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('retakePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={confirmPhoto}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t('useThisPhoto')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-400 hover:text-white font-bold text-xs"
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={takeSnapshot}
                disabled={!!cameraError}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>{t('snapPhoto')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
