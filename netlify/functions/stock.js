/* ============================================================================
   GET /.netlify/functions/stock
   Returns APEAX stock visibility for the installer's tier.
   Requires installer JWT. Cost prices stripped before response.
   SHIELD-side stock views use the ASI Portal direct, not this function.
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

    const qs = event.queryStringParameters || {};
    const query = new URLSearchParams();
    if (qs.category) query.set('category', qs.category);
    if (qs.sku) query.set('sku', qs.sku);

    const path = `/api/apeax/stock${query.toString() ? `?${query}` : ''}`;

    const result = await callPortal(path, {
      method: 'GET',
      bearerJwt: jwt,
    });

    return ok({
      success: true,
      stock: sanitiseForInstaller(result.stock || result),
      asOf: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[stock]', err.statusCode || 500);
    if (err instanceof PortalError) {
      if (err.statusCode === 401) return bad('Session expired. Please sign in again.', 401);
      return bad(err.message, err.statusCode);
    }
    return bad('Unexpected error', 500);
  }
};
