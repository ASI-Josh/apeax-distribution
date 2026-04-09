/* ============================================================================
   GET /.netlify/functions/health
   Public health check. Confirms Netlify Function runtime is up and
   the Portal backend is reachable. Does not reveal SHIELD credentials.
   Used by uptime monitoring and CIPHER's dashboard.
   ============================================================================ */

const { callPortal, ok, bad, handleOptions } = require('./_lib/portal');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'GET') return bad('Method not allowed', 405);

  const runtime = {
    service: 'apeax-distribution-portal',
    node: process.version,
    region: process.env.AWS_REGION || 'unknown',
    checkedAt: new Date().toISOString(),
  };

  let portalReachable = false;
  let portalLatencyMs = null;
  try {
    const start = Date.now();
    await callPortal('/api/apeax/health', { method: 'GET', shieldOnly: true, timeoutMs: 4000 });
    portalLatencyMs = Date.now() - start;
    portalReachable = true;
  } catch (err) {
    // Don't leak error detail
  }

  return ok({
    status: portalReachable ? 'healthy' : 'degraded',
    runtime,
    portal: {
      reachable: portalReachable,
      latencyMs: portalLatencyMs,
    },
  });
};
