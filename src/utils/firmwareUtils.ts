
import { imperialServerService } from './imperialServerService';

/**
 * Analyzes firmware for known vulnerabilities and potential exploits
 * Uses server-side NVD API key
 */
export const analyzeFirmware = async (brand: string, model: string, version: string) => {
  console.log(`Analyzing firmware for ${brand} ${model} version ${version}`);
  
  try {
    // Use server-side implementation with secure API keys
    const response = await imperialServerService.executeOsintTool('firmware-analysis', {
      brand: brand.toLowerCase(),
      model: model.toLowerCase(),
      version
    });
    
    if (!response || !response.success) {
      console.error('Firmware analysis error:', response?.error || 'Unknown error');
      return {
        knownVulnerabilities: [],
        outdated: false,
        lastUpdate: null,
        recommendedVersion: null
      };
    }
    
    return {
      knownVulnerabilities: response.data?.vulnerabilities || [],
      outdated: response.data?.outdated || false,
      lastUpdate: response.data?.lastUpdate || null,
      recommendedVersion: response.data?.recommendedVersion || null
    };
  } catch (error) {
    console.error(`Error analyzing firmware: ${error}`);
    return {
      knownVulnerabilities: [],
      outdated: false,
      lastUpdate: null,
      recommendedVersion: null
    };
  }
};
