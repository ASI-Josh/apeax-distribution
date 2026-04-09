/* ============================================================================
   POST /.netlify/functions/quote-request
   Public quote form. Forwards to ASI Portal /api/apeax/quote-request.
   Feeds SHIELD's triage queue with source: apeax_portal_quote.
   ============================================================================ */

const {
  callPortal,
  PortalError,
  ok,
  bad,
  handleOptions,
  parseJsonBody,
  requireFields,
  normaliseAbn,
  normaliseEmail,
} = require('./_lib/portal');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = parseJsonBody(event);

    requireFields(body, [
      'company',
      'abn',
      'contactName',
      'email',
      'phone',
      'state',
      'postcode',
      'category',
      'exclusivity',
    ]);

    const payload = {
      source: 'apeax_portal_quote',
      company: String(body.company).trim(),
      abn: normaliseAbn(body.abn),
      contactName: String(body.contactName).trim(),
      role: body.role ? String(body.role).trim() : null,
      email: normaliseEmail(body.email),
      phone: String(body.phone).trim(),
      state: String(body.state).toUpperCase(),
      postcode: String(body.postcode).trim(),
      category: body.category,
      films: Array.isArray(body.films) ? body.films : [],
      quantity: body.quantity ? String(body.quantity).trim() : null,
      timeframe: body.timeframe || null,
      notes: body.notes ? String(body.notes).trim() : null,
      exclusivity: body.exclusivity,
      submittedAt: new Date().toISOString(),
      userAgent: event.headers?.['user-agent'] || null,
    };

    const result = await callPortal('/api/apeax/quote-request', {
      method: 'POST',
      body: payload,
      shieldOnly: true,
    });

    return ok({
      success: true,
      quoteId: result.quoteId || result.id,
      message: 'Your enquiry has been lodged with SHIELD. Expect an acknowledgement within 4 hours.',
    });
  } catch (err) {
    console.error('[quote-request]', err);
    if (err instanceof PortalError) {
      return bad(err.message, err.statusCode, err.detail);
    }
    return bad('Unexpected error', 500);
  }
};
