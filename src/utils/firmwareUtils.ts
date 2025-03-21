
/**
 * Analyzes firmware for known vulnerabilities and potential exploits
 */
export const analyzeFirmware = async (brand: string, model: string, version: string) => {
  console.log(`Analyzing firmware for ${brand} ${model} version ${version}`);
  
  // Get NVD API key from localStorage
  const nvdApiKey = localStorage.getItem('NVD_API_KEY');
  if (!nvdApiKey) {
    console.warn('No NVD API key configured. Please add your NVD API key in Settings -> API Keys.');
    return {
      knownVulnerabilities: [], // Now always returning an array, not undefined
      outdated: false,
      lastUpdate: null,
      recommendedVersion: null
    };
  }
  
  try {
    // Query the NVD API for vulnerabilities related to this firmware
    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=cpe:2.3:o:${brand.toLowerCase()}:${model.toLowerCase()}:${version}`,
      {
        headers: {
          'apiKey': nvdApiKey
        }
      }
    );
    
    if (!response.ok) {
      console.error(`NVD API error: ${response.status} ${response.statusText}`);
      return {
        knownVulnerabilities: [], // Now always returning an array, not undefined
        outdated: false,
        lastUpdate: null,
        recommendedVersion: null
      };
    }
    
    const data = await response.json();
    const vulnerabilities = data?.vulnerabilities || [];
    
    // Extract CVE IDs from the response
    const cveIds = vulnerabilities.map((vuln: any) => vuln.cve?.id || '').filter(Boolean);
    
    return {
      knownVulnerabilities: cveIds,
      outdated: cveIds.length > 0, // Consider outdated if it has vulnerabilities
      lastUpdate: null, // We don't have this information
      recommendedVersion: null // We don't have this information
    };
  } catch (error) {
    console.error(`Error analyzing firmware: ${error}`);
    return {
      knownVulnerabilities: [], // Now always returning an array, not undefined
      outdated: false,
      lastUpdate: null,
      recommendedVersion: null
    };
  }
};
