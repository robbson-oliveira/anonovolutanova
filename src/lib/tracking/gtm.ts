/**
 * Trecho do <head> que liga o Google Tag Manager com Consent Mode v2.
 *
 * Usado em dois lugares com o mesmo texto: o layout das páginas React e a
 * resposta do wireframe (`src/app/route.ts`), que é HTML puro.
 *
 * Todo consentimento começa NEGADO (LGPD): o GTM carrega, mas GA4 e Meta só
 * gravam cookies depois que a pessoa aceita no aviso de cookies
 * (`src/features/shell/ConsentBanner.tsx`), que chama `gtag('consent', 'update', …)`. Uma escolha
 * já feita é reaplicada aqui, antes do GTM, para não haver página sem ela.
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
  if (c === 'granted') gtag('consent', 'update', {
    ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
    analytics_storage: 'granted'
  });
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
