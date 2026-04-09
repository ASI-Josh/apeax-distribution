/* ============================================================================
   GET /.netlify/functions/trade-dashboard
   Returns installer profile + order history + stock with installer pricing.
   Requires installer JWT bearer token.
   Sanitises all cost prices and internal flags before returning to browser.
   ============================================================================ */

const {
  callPortal,
  PortalError,
  ok,
  bad,
  handleOptions,
  getBearer,
  sanitiseForInstaller,
} = require('./_lib/portal');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'GET') return bad('Method not allowed', 405);

  try {
    const jwt = getBearer(event);
    if (!jwt) return bad('Authentication required', 401);

    const result = await callPortal('/api/apeax/trade-dashboard', {
      method: 'GET',
      bearerJwt: jwt,
    });

    return ok({
      success: true,
      data: sanitiseForInstaller(result),
    });
  } catch (err) {
    console.error('[trade-dashboard]', err.statusCode || 500);
    if (err instanceof PortalError) {
      if (err.statusCode === 401) return bad('Session expired. Please sign in again.', 401);
      return bad(err.message, err.statusCode);
    }
    return bad('Unexpected error', 500);
  }
};
