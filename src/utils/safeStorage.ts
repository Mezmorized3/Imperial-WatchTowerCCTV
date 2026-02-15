
/**
 * Safe storage utilities that avoid storing sensitive data in localStorage.
 * Sensitive tokens/keys should use sessionStorage (cleared on tab close)
 * or be managed server-side.
 */

const SENSITIVE_KEYS = [
  'imperialToken',
  'VIRUSTOTAL_API_KEY',
  'ABUSEIPDB_API_KEY',
  'NVD_API_KEY',
];

/**
 * Safely parse JSON from storage, returning fallback on failure.
 */
export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Store a value - uses sessionStorage for sensitive keys, localStorage for others.
 */
export function secureSetItem(key: string, value: string): void {
  if (SENSITIVE_KEYS.includes(key)) {
    sessionStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, value);
  }
}

/**
 * Retrieve a value - checks sessionStorage for sensitive keys, localStorage for others.
 */
export function secureGetItem(key: string): string | null {
  if (SENSITIVE_KEYS.includes(key)) {
    return sessionStorage.getItem(key);
  }
  return localStorage.getItem(key);
}

/**
 * Remove a value from the appropriate storage.
 */
export function secureRemoveItem(key: string): void {
  if (SENSITIVE_KEYS.includes(key)) {
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * Sanitize a URL input to prevent javascript: and data: protocol injections.
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return '';
  }
  return trimmed;
}

/**
 * Validate that a string looks like a legitimate stream/server URL.
 */
export function isValidStreamUrl(url: string): boolean {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return false;
  
  // Allow common stream protocols
  const allowedProtocols = ['http://', 'https://', 'rtsp://', 'rtmp://', '/'];
  return allowedProtocols.some(p => sanitized.toLowerCase().startsWith(p));
}
