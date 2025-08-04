// CDN configuration for media files
// Switch between local and CDN paths

// CDN Configuration
const CDN_CONFIG = {
  // Use environment variables with fallbacks
  USE_CDN: import.meta.env.VITE_USE_CDN === 'true' || import.meta.env.PROD,
  
  // DigitalOcean Spaces CDN URL from environment
  CDN_BASE_URL: import.meta.env.VITE_CDN_BASE_URL || 'https://laura-nathan-wedding-photos.nyc3.digitaloceanspaces.com',
  
  // Local development path
  LOCAL_BASE_URL: '/Pictures-Optimized'
};

/**
 * Get the full URL for a media file
 * @param {string} folder - The folder name (e.g., "2025-07-18_Bachelor Party" or "2025-08-01_Odawara Castle_Travel Back/1_Odawara Castle")
 * @param {string} filename - The filename (e.g., "image.jpg")
 * @returns {string} Full URL to the media file
 */
export function getMediaUrl(folder, filename) {
  const baseUrl = CDN_CONFIG.USE_CDN ? CDN_CONFIG.CDN_BASE_URL : CDN_CONFIG.LOCAL_BASE_URL;
  
  // Split folder path and encode each component separately to preserve forward slashes
  const folderParts = folder.split('/').map(part => encodeURIComponent(part));
  const encodedFolderPath = folderParts.join('/');
  const encodedFilename = encodeURIComponent(filename);
  
  return `${baseUrl}/Pictures-Optimized/${encodedFolderPath}/${encodedFilename}`;
}

/**
 * Get thumbnail URL (if thumbnails exist)
 * @param {string} folder - The folder name
 * @param {string} filename - The original filename
 * @returns {string} URL to thumbnail or original file
 */
export function getThumbnailUrl(folder, filename) {
  // Check if thumbnail exists (filename_thumb.ext pattern)
  const parts = filename.split('.');
  if (parts.length >= 2) {
    const name = parts.slice(0, -1).join('.');
    const ext = parts[parts.length - 1];
    const thumbnailName = `${name}_thumb.${ext}`;
    
    // In a real app, you'd check if thumbnail exists
    // For now, return the thumbnail URL and fallback to original if needed
    return getMediaUrl(folder, thumbnailName);
  }
  
  return getMediaUrl(folder, filename);
}

/**
 * Switch CDN mode (useful for testing)
 * @param {boolean} useCdn - Whether to use CDN
 */
export function setCdnMode(useCdn) {
  CDN_CONFIG.USE_CDN = useCdn;
}

/**
 * Update CDN base URL (useful for different environments)
 * @param {string} newUrl - New CDN base URL
 */
export function setCdnBaseUrl(newUrl) {
  CDN_CONFIG.CDN_BASE_URL = newUrl;
}

export default {
  getMediaUrl,
  getThumbnailUrl,
  setCdnMode,
  setCdnBaseUrl,
  config: CDN_CONFIG
};
