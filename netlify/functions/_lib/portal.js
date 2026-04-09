/* ============================================================================
   APEAX Distribution Portal · Shared Portal Client
   ----------------------------------------------------------------------------
   Thin server-side client for the ASI Portal backend. Injects SHIELD_API_KEY,
   enforces timeouts, normalises errors, and strips any fields the client
   should never see (cost prices, internal flags, JWT secrets).

   Never import this from frontend code. Netlify Functions only.
   ============================================================================ */

const PORTAL_BASE_URL = process.env.PORTAL_BASE_URL || 'https://asiportal.live';
const SHIELD_API_KEY = process.env.SHIELD_API_KEY;
const DEFAULT_TIMEOUT_MS = 12_000;

class PortalError extends Error {
  constructor(message, statusCode = 502, detail = null) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

/**
 * Call the ASI Portal API with SHIELD_API_KEY injection.
 * @param {string} path        path starting with /api/apeax/...
 * @param {object} options
 * @param {string} options.method      HTTP method
 * @param {object} [options.body]      JSON body
 * @param {string} [options.bearerJwt] Installer JWT (forwarded, not issued here)
 * @param {boolean} [options.shieldOnly] Attach SHIELD_API_KEY header
 */
async function callPortal(path, options = {}) {
  if (!SHIELD_API_KEY && options.shieldOnly) {
    throw new PortalError('SHIELD_API_KEY not configured', 500);
  }

  const url = `${PORTAL_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Source': 'apeax-portal-netlify',
  };

  if (options.shieldOnly) {
    headers['X-SHIELD-API-Key'] = SHIELD_API_KEY;
  }

  if (options.bearerJwt) {
    headers.Authorization = `Bearer ${options.bearerJwt}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { raw: text };
      }
    }

    if (!res.ok) {
      throw new PortalError(
        data?.message || `Portal returned ${res.status}`,
        res.status,
        data
      );
    }

    return data;
  } catch (err) {
    if (err instanceof PortalError) throw err;
    if (err.name === 'AbortError') {
      throw new PortalError('Portal request timed out', 504);
    }
    throw new PortalError(err.message || 'Portal request failed', 502);
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- HTTP helpers for Netlify Function handlers ---------- */

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://apeax.com.au',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function ok(body, statusCode = 200) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

function bad(message, statusCode = 400, detail = null) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify({ error: message, detail }),
  };
}

function handleOptions() {
  return { statusCode: 204, headers: JSON_HEADERS, body: '' };
}

function parseJsonBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (_) {
    throw new PortalError('Invalid JSON body', 400);
  }
}

function getBearer(event) {
  const h = event.headers?.authorization || event.headers?.Authorization;
  if (!h) return null;
  const m = h.match(/^Bearer (.+)$/i);
  return m ? m[1] : null;
}

/* ---------- Lightweight validators ---------- */

function requireFields(obj, fields) {
  const missing = fields.filter((f) => obj[f] == null || obj[f] === '');
  if (missing.length) {
    throw new PortalError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
}

function normaliseAbn(abn) {
  if (!abn) return null;
  return String(abn).replace(/\s+/g, '');
}

function normaliseEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/* ---------- Output sanitisation ---------- */

/**
 * Strip fields that should never reach the browser.
 * Cost prices, internal flags, vetting notes, SHIELD-only metadata.
 */
function sanitiseForInstaller(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = JSON.parse(JSON.stringify(obj));
  const stripKeys = [
    'unitCostUsd',
    'landedCostAud',
    'freightMarkupUsed',
    'cogsAud',
    'marginAud',
    'shieldNotes',
    'vettingNotes',
    'internalFlags',
    'apeaxUsaPoRef',
  ];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      for (const k of stripKeys) delete node[k];
      Object.values(node).forEach(walk);
    }
  };
  walk(clone);
  return clone;
}

module.exports = {
  callPortal,
  PortalError,
  ok,
  bad,
  handleOptions,
  parseJsonBody,
  getBearer,
  requireFields,
  normaliseAbn,
  normaliseEmail,
  sanitiseForInstaller,
};
