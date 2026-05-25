'use client';

import { useState, useRef, useEffect } from 'react';
import { validateZoomLevel, validateImageDimensions, calculateImageQualityScore } from '@/lib/image-validation';

export default function ImageEditor({ photo, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [qualityScore, setQualityScore] = useState(null);
  const [dimensionWarning, setDimensionWarning] = useState(null);
  const [zoomWarning, setZoomWarning] = useState(null);

  // Load and draw image on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size
      canvas.width = Math.min(img.width, window.innerWidth - 40);
      canvas.height = (canvas.width / img.width) * img.height;

      // Validate dimensions
      const dimValidation = validateImageDimensions(img);
      if (dimValidation.warning) {
        setDimensionWarning(dimValidation.warning);
      }

      // Calculate initial quality score
      const quality = calculateImageQualityScore(
        { width: img.naturalWidth, height: img.naturalHeight },
        1
      );
      setQualityScore(quality);

      redraw(ctx, img);
      setImageLoaded(true);
    };

    img.src = photo.preview;
  }, [photo]);

  // Redraw canvas with current transformations
  const redraw = (ctx, img) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2 + position.x, -canvas.height / 2 + position.y);

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  // Update canvas when scale or position changes
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Check zoom level
      const zoomCheck = validateZoomLevel(scale);
      if (zoomCheck.warning) {
        setZoomWarning(zoomCheck.warning);
      } else {
        setZoomWarning(null);
      }

      // Update quality score
      const quality = calculateImageQualityScore(
        { width: img.naturalWidth, height: img.naturalHeight },
        scale
      );
      setQualityScore(quality);

      redraw(ctx, img);
    };

    img.src = photo.preview;
  }, [scale, position, imageLoaded]);

  // Mouse/Touch events for panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setDragStart({ ...dragStart, distance });
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition((prev) => ({ x: newX, y: newY }));
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const zoomDelta = (distance - dragStart.distance) / 100;
      setScale((prev) => Math.max(0.5, Math.min(2, prev + zoomDelta)));
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      setPosition((prev) => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const editedImage = canvas.toDataURL('image/jpeg', 0.95);

    onSave({
      ...photo,
      preview: editedImage,
      scale,
      position,
    });
  };

  const resetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const getQualityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBgColor = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 75) return 'bg-blue-50 border-blue-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary font-display">Edit Photo for 2"x2" Print</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Quality Score Card */}
          {qualityScore && (
            <div className={`mb-6 rounded-lg p-4 border-2 ${getQualityBgColor(qualityScore.score)}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-bold ${getQualityColor(qualityScore.score)}`}>
                  Print Quality: {qualityScore.level} ({qualityScore.score}/100)
                </h3>
                <div className="w-32 bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      qualityScore.score >= 90
                        ? 'bg-green-600'
                        : qualityScore.score >= 75
                          ? 'bg-blue-600'
                          : qualityScore.score >= 60
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                    }`}
                    style={{ width: `${qualityScore.score}%` }}
                  ></div>
                </div>
              </div>
              
              {qualityScore.recommendations.length > 0 && (
                <ul className="text-sm text-gray-700 space-y-1 mt-3">
                  {qualityScore.recommendations.map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Warnings */}
          {(dimensionWarning || zoomWarning) && (
            <div className="mb-6 space-y-3">
              {dimensionWarning && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
                  <span>⚠️</span>
                  <span>{dimensionWarning}</span>
                </div>
              )}
              {zoomWarning && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
                  <span>⚠️</span>
                  <span>{zoomWarning}</span>
                </div>
              )}
            </div>
          )}

          {/* Canvas */}
          <div
            className="mb-6 bg-light rounded-lg overflow-hidden flex items-center justify-center cursor-move touch-none select-none"
            style={{ height: '400px', border: '2px solid #ddd' }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="max-w-full max-h-full cursor-move"
            />
          </div>

          {/* Print Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <p className="font-medium mb-2">📏 2"x2" Print Specifications</p>
            <ul className="space-y-1 text-xs">
              <li>• Optimal resolution: 600x600 pixels minimum (2" × 300 DPI)</li>
              <li>• Recommended: 800x800 pixels or higher for best quality</li>
              <li>• Maximum zoom: 200% to prevent pixelation</li>
              <li>• Aspect ratio: Square (1:1) for perfect 2"x2" square print</li>
            </ul>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-primary">Zoom</label>
                <span className={`text-sm font-semibold ${getQualityColor(qualityScore?.score || 50)}`}>
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
                  className="flex-1 px-4 py-2 bg-light border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm transition-all"
                >
                  − Zoom Out
                </button>
                <button
                  onClick={() => setScale((prev) => Math.min(2, prev + 0.2))}
                  className="flex-1 px-4 py-2 bg-light border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm transition-all"
                >
                  + Zoom In
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ℹ️ Zoom beyond 200% may reduce print quality
              </p>
            </div>

            {/* Position Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">📱 Editing Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>🖱️ <strong>Desktop:</strong> Drag to move image, use slider to zoom</li>
                <li>📱 <strong>Mobile:</strong> Drag with one finger to move, pinch to zoom</li>
                <li>⭐ <strong>Tip:</strong> Keep zoom between 100-150% for best results</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={resetTransform}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                Reset
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-light text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
