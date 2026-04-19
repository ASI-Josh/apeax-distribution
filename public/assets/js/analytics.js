/* ============================================================================
   APEAX Distribution Portal · Analytics loader (GA4)
   ----------------------------------------------------------------------------
   Minimal async GA4 initialisation. Measurement ID lives in one place (below).
   Rotate by editing GA4_MEASUREMENT_ID and redeploying.
   CSP additions handled in netlify.toml (connect-src, script-src).
   Built by CIPHER, 2026-04-19
   ============================================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------------------
  // PRODUCTION MEASUREMENT ID
  // Replace with the real G-XXXXXXXXXX value from the APEAX GA4 property.
  // Stored here deliberately (GA4 IDs are public by design). Do not treat
  // as a secret. Rotate via the GA4 admin UI if compromised.
  // ----------------------------------------------------------------------
  var GA4_MEASUREMENT_ID = 'G-S6EXL3M2T7';

  // Soft-fail if placeholder still present; warn once, do not block page.
  if (GA4_MEASUREMENT_ID === 'G-PLACEHOLDER' || !GA4_MEASUREMENT_ID) {
    if (window && window.console && window.console.warn) {
      window.console.warn('[apeax-analytics] GA4_MEASUREMENT_ID not configured. Analytics inactive.');
    }
    return;
  }

  // Honour Do-Not-Track (defensive; GA4 does not respect DNT by default).
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return;
  }

  // GA4 loader (official async pattern).
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    // Respect privacy: IP anonymisation (deprecated in GA4 but harmless),
    // send_page_view default true, allow_ad_personalization_signals false.
    anonymize_ip: true,
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
  });

  // Surface a tiny helper for custom events from other scripts.
  window.apeaxTrack = function (eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  };
})();
