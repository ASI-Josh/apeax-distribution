/* ============================================================================
   POST /.netlify/functions/trade-order
   Installer places a new direct order. Forwards to /api/apeax/trade-order.
   Backend creates apeaxOrders record + linked distribution job with ISO
   touchpoints seeded (8.2.1, 8.2.2, 8.4.1).
   ============================================================================ */

const {
  callPortal,
  PortalError,
  ok,
  bad,
  handleOptions,
  parseJsonBody,
  requireFields,
  getBearer,
  sanitiseForInstaller,
} = require('./_lib/portal');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return bad('Method not allowed', 405);

  try {
    const jwt = getBearer(event);
    if (!jwt) return bad('Authentication required', 401);

    const body = parseJsonBody(event);
    requireFields(body, ['lineItems']);

    if (!Array.isArray(body.lineItems) || body.lineItems.length === 0) {
      return bad('At least one line item required', 400);
    }

    for (const [idx, li] of body.lineItems.entries()) {
      if (!li.sku || !li.quantity) {
        return bad(`Line item ${idx + 1} missing sku or quantity`, 400);
      }
      if (Number(li.quantity) <= 0) {
        return bad(`Line item ${idx + 1} quantity must be positive`, 400);
      }
    }

    const payload = {
      lineItems: body.lineItems.map((li) => ({
        sku: String(li.sku).trim(),
        quantity: Number(li.quantity),
        notes: li.notes ? String(li.notes).trim() : null,
      })),
      freightPreference: body.freightPreference || 'sea',
      deliveryInstructions: body.deliveryInstructions
        ? String(body.deliveryInstructions).trim()
        : null,
      purchaseOrderRef: body.purchaseOrderRef
        ? String(body.purchaseOrderRef).trim()
        : null,
      submittedAt: new Date().toISOString(),
    };

    const result = await callPortal('/api/apeax/trade-order', {
      method: 'POST',
      body: payload,
      bearerJwt: jwt,
    });

    return ok({
      success: true,
      orderId: result.orderId,
      orderRef: result.orderRef,
      linkedJobId: result.linkedJobId,
      status: result.status || 'pending_shield_validation',
      estimatedPricingAud: sanitiseForInstaller(result.estimatedPricingAud || null),
      message:
        'Order lodged. SHIELD will validate stock and commit an ETA within 4 hours.',
    });
  } catch (err) {
    console.error('[trade-order]', err.statusCode || 500);
    if (err instanceof PortalError) {
      if (err.statusCode === 401) return bad('Session expired. Please sign in again.', 401);
      return bad(err.message, err.statusCode);
    }
    return bad('Unexpected error', 500);
  }
};
