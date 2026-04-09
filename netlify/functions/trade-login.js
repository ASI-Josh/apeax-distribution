/* ============================================================================
   POST /.netlify/functions/trade-login
   Exchanges installer email + password for a signed JWT.
   JWT is issued by ASI Portal, this function is a thin proxy only.
   Raw password never touches local storage, never logged.
   ============================================================================ */

const {
  callPortal,
  PortalError,
  ok,
  bad,
  handleOptions,
  parseJsonBody,
  requireFields,
  normaliseEmail,
} = require('./_lib/portal');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = parseJsonBody(event);
    requireFields(body, ['email', 'password']);

    const payload = {
      email: normaliseEmail(body.email),
      password: body.password,
      clientInfo: {
        userAgent: event.headers?.['user-agent'] || null,
        ip: event.headers?.['x-forwarded-for'] || null,
      },
    };

    const result = await callPortal('/api/apeax/trade-login', {
      method: 'POST',
      body: payload,
      shieldOnly: true,
    });

    if (!result.token) {
      return bad('Authentication failed', 401);
    }

    return ok({
      success: true,
      token: result.token,
      expiresAt: result.expiresAt,
      tradeAccount: {
        id: result.tradeAccount?.id,
        legalName: result.tradeAccount?.legalName,
        tradingAs: result.tradeAccount?.tradingAs,
        discountTier: result.tradeAccount?.discountTier,
      },
    });
  } catch (err) {
    console.error('[trade-login]', err.statusCode || 500);
    if (err instanceof PortalError) {
      if (err.statusCode === 401 || err.statusCode === 403) {
        return bad('Invalid credentials', 401);
      }
      return bad(err.message, err.statusCode);
    }
    return bad('Unexpected error', 500);
  }
};
