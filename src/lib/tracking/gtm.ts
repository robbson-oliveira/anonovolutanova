/**
 * Head snippet that boots Google Tag Manager with Consent Mode v2.
 *
 * Used in two places with the same text: the React layout and the wireframe
 * response (`src/app/route.ts`), which is plain HTML.
 *
 * Consent defaults to denied, then is granted right away unless the visitor
 * declined before (implicit consent). The Meta base tag (GTM tag 13) listens
 * only for `anln_consent_granted`, so that event is pushed here, before GTM
 * boots, on every visit without a stored refusal. The cookie notice
 * (`src/features/shell/ConsentBanner.tsx`) stays visible until an explicit
 * choice: "Recusar" stores `denied` and turns consent off; "Aceitar" stores
 * `granted` and does not push the event again on the same page.
 *
 * A stored choice also marks `<html data-anln-consent-stored>` before the
 * body paints, so the server-rendered notice stays hidden for returning
 * visitors without a flash.
 */

export const CONSENT_STORAGE_KEY = "anln_consent";

export function gtmHeadSnippet(gtmId: string | undefined): string {
  const consent = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', wait_for_update: 500
});
// No stored refusal means implicit grant; storage errors count as no choice.
var marketing = true;
var analytics = true;
try {
  var c = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if (c) document.documentElement.setAttribute('data-anln-consent-stored', '');
  if (c === 'denied') { marketing = false; analytics = false; }
  // A stored object with categories gates each category on its own.
  if (c && c.charAt(0) === '{') {
    var parsed = JSON.parse(c);
    var cats = parsed && parsed.categories;
    if (cats) {
      var mark = cats.marketing;
      var stats = cats.analytics;
      marketing = mark === true || mark === 'granted';
      analytics = stats === true || stats === 'granted';
    }
  }
} catch (e) {}
if (marketing || analytics) gtag('consent', 'update', {
  ad_storage: marketing ? 'granted' : 'denied',
  ad_user_data: marketing ? 'granted' : 'denied',
  ad_personalization: marketing ? 'granted' : 'denied',
  analytics_storage: analytics ? 'granted' : 'denied'
});
if (marketing) dataLayer.push({event:'anln_consent_granted'});
`;

  if (!gtmId || !/^GTM-[A-Z0-9]+$/.test(gtmId)) return consent;

  return (
    consent +
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
    `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;` +
    `j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
    `})(window,document,'script','dataLayer','${gtmId}');`
  );
}
