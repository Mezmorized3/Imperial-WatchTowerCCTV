
// Update the executePhoton call to match its expected parameters
// Change from:
const result = await executePhoton({
  url,
  depth: parseInt(depth),
  timeout: parseInt(timeout),
  threads: parseInt(threads),
  delay: parseInt(delay),
  userAgent,
  saveResults
});

// To:
const result = await executePhoton(url);
