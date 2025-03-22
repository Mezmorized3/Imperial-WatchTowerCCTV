
/**
 * Threat intelligence utility for Imperial Shield system
 * Provides methods for checking IP threats and analyzing firmware
 */

import { checkVirusTotal, checkAbuseIPDB } from './threatApiUtils';
import { ThreatIntelData } from '@/types/scanner';
import { analyzeFirmware as analyzeDeviceFirmware } from './threat/firmwareAnalyzer';
import { getComprehensiveThreatIntel as getDetailedThreatIntel } from './threat/threatIntelGenerator';

/**
 * Get comprehensive threat intelligence for an IP address
 * This function will try multiple sources and combine the results
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData> => {
  console.log(`Getting comprehensive threat intel for IP: ${ip}`);
  
  try {
    // In production, use real threat intelligence APIs
    // Try VirusTotal first
    const vtResult = await checkVirusTotal(ip);
    if (vtResult) {
      return vtResult;
    }
    
    // Try AbuseIPDB if VirusTotal failed or returned null
    const abuseResult = await checkAbuseIPDB(ip);
    if (abuseResult) {
      return abuseResult;
    }
    
    // If both failed, use our internal generator (should be replaced with real data)
    return await getDetailedThreatIntel(ip);
  } catch (error) {
    console.error(`Error fetching threat intelligence: ${error}`);
    // Fallback to our generator
    return await getDetailedThreatIntel(ip);
  }
};

/**
 * Analyze firmware for vulnerabilities and security issues
 */
export const analyzeFirmware = async (
  manufacturer: string,
  model: string,
  firmwareVersion: string
): Promise<any> => {
  console.log(`Analyzing firmware: ${manufacturer} ${model} ${firmwareVersion}`);
  
  try {
    // In production, this would call a real firmware analysis API
    return await analyzeDeviceFirmware(manufacturer, model, firmwareVersion);
  } catch (error) {
    console.error(`Error analyzing firmware: ${error}`);
    throw error;
  }
};
