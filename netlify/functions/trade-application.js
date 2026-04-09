/* ============================================================================
   POST /.netlify/functions/trade-application
   Public trade installer application. Forwards to ASI Portal
   /api/apeax/trade-application. Backend handles 12-month lockout check.
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

const REQUIRED_ATTESTATIONS = ['att1', 'att2', 'att3', 'att4', 'att5'];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return bad('Method not allowed', 405);

  try {
    const body = parseJsonBody(event);

    requireFields(body, [
      'legalName',
      'abn',
      'yearsTrading',
      'contactName',
      'position',
      'email',
      'phone',
      'workshopAddress',
      'suburb',
      'postcode',
      'state',
      'bays',
      'sectorFocus',
      'experience',
    ]);

    const missingAttestations = REQUIRED_ATTESTATIONS.filter((a) => body[a] !== true);
    if (missingAttestations.length) {
      return bad(
        `All 5 attestations must be confirmed. Missing: ${missingAttestations.join(', ')}`,
        400
      );
    }

    const payload = {
      legalName: String(body.legalName).trim(),
      tradingAs: body.trading ? String(body.trading).trim() : null,
      abn: normaliseAbn(body.abn),
      yearsTrading: body.yearsTrading,
      website: body.website ? String(body.website).trim() : null,

      primaryContact: {
        fullName: String(body.contactName).trim(),
        position: String(body.position).trim(),
        email: normaliseEmail(body.email),
        phone: String(body.phone).trim(),
      },
      accountsContact: {
        email: body.accountsEmail ? normaliseEmail(body.accountsEmail) : null,
        phone: body.accountsPhone ? String(body.accountsPhone).trim() : null,
      },
      workshop: {
        address: String(body.workshopAddress).trim(),
        suburb: String(body.suburb).trim(),
        state: String(body.state).toUpperCase(),
        postcode: String(body.postcode).trim(),
        bays: body.bays,
      },
      experience: {
        currentBrands: body.currentBrands ? String(body.currentBrands).trim() : null,
        sectorFocus: body.sectorFocus,
        narrative: String(body.experience).trim(),
      },
      attestations: {
        exclusivity: true,
        competency: true,
        warrantyRegistration: true,
        pricingConfidentiality: true,
        brandRepresentation: true,
        attestedAt: new Date().toISOString(),
      },

      submittedAt: new Date().toISOString(),
      userAgent: event.headers?.['user-agent'] || null,
      sourceIp: event.headers?.['x-forwarded-for'] || event.headers?.['client-ip'] || null,
    };

    const result = await callPortal('/api/apeax/trade-application', {
      method: 'POST',
      body: payload,
      shieldOnly: true,
    });

    if (result.lockedOut) {
      return bad(
        'Your previous application was declined within the past 12 months. Please contact SHIELD directly if circumstances have changed.',
        409,
        { lockoutExpiresAt: result.lockoutExpiresAt }
      );
    }

    return ok({
      success: true,
      applicationId: result.applicationId || result.id,
      status: result.status || 'pending_vetting',
      message:
        'Application lodged with SHIELD. Expect a vetting decision within 3 business days.',
    });
  } catch (err) {
    console.error('[trade-application]', err);
    if (err instanceof PortalError) {
      return bad(err.message, err.statusCode, err.detail);
    }
    return bad('Unexpected error', 500);
  }
};
