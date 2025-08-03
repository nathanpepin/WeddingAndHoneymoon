// Utility functions for handling media files
export const getMediaPath = (dayKey, filename, subfolderName = null) => {
  const basePath = '/Pictures-Optimized';
  if (subfolderName) {
    return `${basePath}/${dayKey}/${subfolderName}/${filename}`;
  }
  return `${basePath}/${dayKey}/${filename}`;
};

export const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.heic', '.tiff', '.webp'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return imageExtensions.includes(extension);
};

export const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.m4v', '.webm'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return videoExtensions.includes(extension);
};

export const getFileType = (filename) => {
  if (isImageFile(filename)) return 'image';
  if (isVideoFile(filename)) return 'video';
  return 'unknown';
};

// Convert HEIC files to JPEG for web display (using optimized versions)
export const getDisplayPath = (dayKey, filename, subfolderName = null) => {
  let displayFilename = filename;
  
  // HEIC files have been converted to JPEG in the optimization process
  if (filename.toLowerCase().endsWith('.heic')) {
    displayFilename = filename.replace(/\.heic$/i, '.jpg');
  }
  
  // For videos, try mp4 first, then fall back to original extension
  if (isVideoFile(filename)) {
    // If the filename already has .mp4, use it as-is
    if (filename.toLowerCase().endsWith('.mp4')) {
      displayFilename = filename;
    } else {
      // Try the mp4 version first
      displayFilename = filename.replace(/\.(mov|avi|mkv|wmv|m4v|webm)$/i, '.mp4');
    }
  }
  
  return getMediaPath(dayKey, displayFilename, subfolderName);
};

// Get alternative video path (for fallback)
export const getVideoFallbackPath = (dayKey, filename, subfolderName = null) => {
  if (!isVideoFile(filename)) return null;
  
  // If current filename is .mp4, try .MOV
  if (filename.toLowerCase().endsWith('.mp4')) {
    const fallbackFilename = filename.replace(/\.mp4$/i, '.MOV');
    return getMediaPath(dayKey, fallbackFilename, subfolderName);
  }
  
  // If current filename is something else, try .mp4
  const fallbackFilename = filename.replace(/\.(mov|avi|mkv|wmv|m4v|webm)$/i, '.mp4');
  return getMediaPath(dayKey, fallbackFilename, subfolderName);
};

// Function to create a thumbnail path (using optimized thumbnails)
export const getThumbnailPath = (dayKey, filename, subfolderName = null) => {
  // For videos, use the generated thumbnail
  if (isVideoFile(filename)) {
    const thumbnailFilename = filename.replace(/\.(mp4|mov|avi|mkv|wmv|m4v|webm)$/i, '_thumbnail.jpg');
    return getMediaPath(dayKey, thumbnailFilename, subfolderName);
  }
  // For images, use the optimized version
  return getDisplayPath(dayKey, filename, subfolderName);
};
