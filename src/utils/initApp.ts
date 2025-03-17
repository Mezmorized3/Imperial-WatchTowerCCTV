
import { initializeZoomEye } from './zoomEyeUtils';

/**
 * Initialize application services on startup
 */
export const initializeApp = () => {
  // Initialize ZoomEye API if key is available in localStorage
  const zoomEyeApiKey = localStorage.getItem('zoomEyeApiKey');
  if (zoomEyeApiKey) {
    try {
      console.log('Initializing ZoomEye API with saved key');
      initializeZoomEye(zoomEyeApiKey);
    } catch (error) {
      console.error('Failed to initialize ZoomEye API with saved key:', error);
      // Clear invalid key
      localStorage.removeItem('zoomEyeApiKey');
    }
  }
};
