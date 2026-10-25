/**
 * Trecho do <head> que liga o Google Tag Manager com Consent Mode v2.
 *
 * Usado em dois lugares com o mesmo texto: o layout das páginas React e a
 * resposta do wireframe (`src/app/route.ts`), que é HTML puro.
 *
 * Todo consentimento começa NEGADO (LGPD): o GTM carrega, mas GA4 e Meta só
 * gravam cookies depois que a pessoa aceita no aviso de cookies
 * (`src/features/shell/ConsentBanner.tsx`), que chama `gtag('consent', 'update', …)`
 * e empurra `anln_consent_granted`. Uma escolha já feita é reaplicada aqui,
 * antes do GTM, inclusive esse evento: a tag de base do Meta escuta só ele,
 * então sem o replay o pixel não existe nas visitas seguintes. O clique no
 * aviso só acontece sem escolha gravada, então o evento não sai duas vezes
 * na mesma visita.
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
try {
  var c = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  // 'granted' is the banner's all-in choice (marketing included). A stored
  // object with categories gates the Meta event on marketing alone.
  var marketing = c === 'granted';
  var analytics = c === 'granted';
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
  if (marketing || analytics) gtag('consent', 'update', {
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
    analytics_storage: analytics ? 'granted' : 'denied'
  });
  if (marketing) dataLayer.push({event:'anln_consent_granted'});
} catch (e) {}
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
