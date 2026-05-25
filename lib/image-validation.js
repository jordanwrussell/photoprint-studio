/**
 * Image Validation Utilities
 * Validates file size, dimensions, and quality for 2"x2" print requirements
 */

// Target print size: 2" x 2" at 300 DPI
// Minimum dimensions: 600 x 600 pixels (at 300 DPI)
// Recommended: 800 x 800 pixels or higher

const IMAGE_VALIDATION = {
  // File size limits
  MAX_FILE_SIZE_MB: 50,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
  
  // Minimum dimensions for 2"x2" at 300 DPI
  // 2 inches * 300 DPI = 600 pixels
  MIN_WIDTH: 600,
  MIN_HEIGHT: 600,
  
  // Recommended dimensions (for best quality)
  RECOMMENDED_WIDTH: 800,
  RECOMMENDED_HEIGHT: 800,
  
  // Aspect ratio tolerance (allow some deviation from square)
  ASPECT_RATIO_TOLERANCE: 0.2, // 20% tolerance
  
  // File type validation
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
  
  // Zoom validation - don't allow too much zoom (quality degradation)
  MAX_ZOOM_LEVEL: 2.0, // Maximum 200% zoom allowed
  
  // Print DPI requirements
  PRINT_DPI: 300,
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateFileSize(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > IMAGE_VALIDATION.MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxMB = IMAGE_VALIDATION.MAX_FILE_SIZE_MB;
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds maximum (${maxMB}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateFileType(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" not supported. Use JPG, PNG, or WebP`,
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 * @param {HTMLImageElement} img - Image element
 * @returns {Object} { valid: boolean, warning: string, dimensions: {width, height, dpi} }
 */
export function validateImageDimensions(img) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;

  // Calculate approximate DPI
  const estimatedDPI = Math.min(width, height) / 2;

  const result = {
    valid: true,
    warning: null,
    dimensions: { width, height, estimatedDPI },
  };

  // Check minimum dimensions
  if (width < IMAGE_VALIDATION.MIN_WIDTH || height < IMAGE_VALIDATION.MIN_HEIGHT) {
    result.valid = false;
    result.error = `Image too small (${width}x${height}). Minimum required: ${IMAGE_VALIDATION.MIN_WIDTH}x${IMAGE_VALIDATION.MIN_HEIGHT} for quality 2"x2" print`;
    return result;
  }

  // Check aspect ratio (should be roughly square for 2"x2")
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  if (aspectRatio > 1 + IMAGE_VALIDATION.ASPECT_RATIO_TOLERANCE) {
    result.warning = `Image is not square (${width}x${height}). The photo will be cropped to a square for your 2"x2" print.`;
  }

  // Recommend higher quality if below recommended size
  if (width < IMAGE_VALIDATION.RECOMMENDED_WIDTH || height < IMAGE_VALIDATION.RECOMMENDED_HEIGHT) {
    result.warning = result.warning
      ? result.warning + ` We recommend ${IMAGE_VALIDATION.RECOMMENDED_WIDTH}x${IMAGE_VALIDATION.RECOMMENDED_HEIGHT}px for best quality.`
      : `For best quality, we recommend uploading at least ${IMAGE_VALIDATION.RECOMMENDED_WIDTH}x${IMAGE_VALIDATION.RECOMMENDED_HEIGHT}px`;
  }

  return result;
}

/**
 * Validate zoom level (canvas transformation)
 * @param {number} zoomLevel - Current zoom level (1.0 = 100%)
 * @returns {Object} { valid: boolean, warning: string }
 */
export function validateZoomLevel(zoomLevel) {
  const result = { valid: true, warning: null };

  if (zoomLevel > IMAGE_VALIDATION.MAX_ZOOM_LEVEL) {
    result.warning = `Zoom level (${Math.round(zoomLevel * 100)}%) is very high. This may reduce print quality. Try a zoom of ${Math.round(IMAGE_VALIDATION.MAX_ZOOM_LEVEL * 100)}% or less for best results.`;
  }

  if (zoomLevel < 0.8) {
    result.warning = `Zoom level (${Math.round(zoomLevel * 100)}%) shows too much of the image. The subject may be too small in your 2"x2" print.`;
  }

  return result;
}

/**
 * Generate quality score based on image properties
 * @param {Object} dimensions - Image dimensions {width, height}
 * @param {number} zoomLevel - Current zoom level
 * @returns {Object} { score: 0-100, level: string, recommendations: string[] }
 */
export function calculateImageQualityScore(dimensions, zoomLevel = 1) {
  const recommendations = [];
  let score = 100;

  const { width, height } = dimensions;
  const minDimension = Math.min(width, height);

  // Check dimensions
  if (minDimension < IMAGE_VALIDATION.RECOMMENDED_WIDTH) {
    const percentOfRecommended = (minDimension / IMAGE_VALIDATION.RECOMMENDED_WIDTH) * 100;
    score -= (100 - percentOfRecommended) * 0.5;
    recommendations.push(`Dimension score: ${minDimension}px (ideal: ${IMAGE_VALIDATION.RECOMMENDED_WIDTH}px)`);
  }

  // Check aspect ratio
  const aspectRatio = Math.max(width, height) / minDimension;
  if (aspectRatio > 1.1) {
    score -= (aspectRatio - 1) * 20;
    recommendations.push(`Aspect ratio: ${aspectRatio.toFixed(2)} (ideal: 1.0 for square 2"x2" print)`);
  }

  // Check zoom
  if (zoomLevel > IMAGE_VALIDATION.MAX_ZOOM_LEVEL) {
    score -= (zoomLevel - IMAGE_VALIDATION.MAX_ZOOM_LEVEL) * 30;
    recommendations.push(`Zoom: ${Math.round(zoomLevel * 100)}% (ideal: under ${Math.round(IMAGE_VALIDATION.MAX_ZOOM_LEVEL * 100)}%)`);
  }

  // Determine quality level
  let level = 'Poor';
  if (score >= 90) level = 'Excellent';
  else if (score >= 75) level = 'Good';
  else if (score >= 60) level = 'Fair';

  return {
    score: Math.max(0, Math.round(score)),
    level,
    recommendations,
  };
}

/**
 * Validate entire image before submission
 * @param {File} file - File object
 * @param {HTMLImageElement} img - Image element (after loading)
 * @param {number} zoomLevel - Current zoom level
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateImageForPrint(file, img, zoomLevel = 1) {
  const errors = [];
  const warnings = [];

  // File size validation
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) errors.push(sizeCheck.error);

  // File type validation
  const typeCheck = validateFileType(file);
  if (!typeCheck.valid) errors.push(typeCheck.error);

  // Dimensions validation
  if (img && img.naturalWidth && img.naturalHeight) {
    const dimCheck = validateImageDimensions(img);
    if (!dimCheck.valid) {
      errors.push(dimCheck.error);
    } else if (dimCheck.warning) {
      warnings.push(dimCheck.warning);
    }

    // Zoom validation
    const zoomCheck = validateZoomLevel(zoomLevel);
    if (zoomCheck.warning) warnings.push(zoomCheck.warning);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get user-friendly quality feedback
 * @param {File} file - File object
 * @param {HTMLImageElement} img - Image element
 * @param {number} zoomLevel - Current zoom level
 * @returns {Object} Detailed feedback with score and recommendations
 */
export function getQualityFeedback(file, img, zoomLevel = 1) {
  const validation = validateImageForPrint(file, img, zoomLevel);
  
  let qualityScore = null;
  if (img && img.naturalWidth && img.naturalHeight) {
    qualityScore = calculateImageQualityScore(
      {
        width: img.naturalWidth,
        height: img.naturalHeight,
      },
      zoomLevel
    );
  }

  return {
    validation,
    qualityScore,
    summary: validation.errors.length > 0
      ? 'Image has issues that need to be fixed'
      : validation.warnings.length > 0
        ? 'Image quality could be improved'
        : 'Image quality is good',
  };
}

export default IMAGE_VALIDATION;
