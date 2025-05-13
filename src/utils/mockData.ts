
import { CameraResult } from '@/types/scanner';

// This function will handle opening an RTSP stream
export const openRtspStream = (camera: CameraResult): string => {
  // Return a properly formatted URL for our viewer
  const rtspUrl = camera.url || `rtsp://${camera.ip}:${camera.port || 554}/Streaming/Channels/101`;
  
  // Construct a URL to our viewer page with the camera info
  const viewerUrl = `/viewer?url=${encodeURIComponent(rtspUrl)}&name=${encodeURIComponent(camera.manufacturer || '')} ${encodeURIComponent(camera.model || '')}`;
  
  // Open the viewer in a new window or tab
  window.open(viewerUrl, '_blank');
  
  return rtspUrl;
};
