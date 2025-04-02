
import type { NextApiRequest, NextApiResponse } from 'next';
import { ScanSettings, CameraResult } from '@/types/scanner';
import { executeCameradar } from '@/utils/osintImplementations/cameraTools';
import { parseIpRange } from '@/utils/ipRangeUtils';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Start SSE stream for real-time updates
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    const { ipRange, settings, scanType, proxy } = req.body as {
      ipRange: string;
      settings: ScanSettings;
      scanType?: string;
      proxy?: any;
    };

    if (!ipRange) {
      sendError(res, 'IP range is required');
      return res.end();
    }

    // Parse the IP range to get individual IPs
    const targets = parseIpRange(ipRange);
    const totalTargets = targets.length;
    
    // Send initial progress
    sendProgress(res, {
      status: 'running',
      targetsTotal: totalTargets,
      targetsScanned: 0,
      camerasFound: 0
    });

    // Process each target IP
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      
      // Update progress
      sendProgress(res, {
        targetsScanned: i + 1,
        targetsTotal: totalTargets
      });
      
      // Scan the target using cameradar
      const scanResult = await executeCameradar({
        target,
        ports: settings.ports?.join(',')
      });
      
      if (scanResult.success && scanResult.data.cameras?.length > 0) {
        // Send each found camera individually
        for (const camera of scanResult.data.cameras) {
          sendCamera(res, camera);
        }
      }
      
      // Small delay to prevent overwhelming the client
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Send final progress update
    sendProgress(res, {
      status: 'completed',
      targetsTotal: totalTargets,
      targetsScanned: totalTargets
    });

    res.end();
  } catch (error) {
    console.error('Error during scan:', error);
    sendError(res, error instanceof Error ? error.message : 'Unknown scan error');
    res.end();
  }
}

// Helper function to send progress updates
function sendProgress(res: NextApiResponse, progress: any) {
  res.write(`${JSON.stringify({
    type: 'progress',
    progress
  })}\n`);
}

// Helper function to send camera discoveries
function sendCamera(res: NextApiResponse, camera: any) {
  res.write(`${JSON.stringify({
    type: 'camera',
    camera
  })}\n`);
}

// Helper function to send errors
function sendError(res: NextApiResponse, error: string) {
  res.write(`${JSON.stringify({
    type: 'error',
    error
  })}\n`);
}
