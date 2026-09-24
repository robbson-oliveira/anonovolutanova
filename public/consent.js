/*
 * Aviso de cookies (LGPD) + Consent Mode v2.
 *
 * Arquivo estático, sem React: é carregado tanto nas páginas do Next quanto
 * na home, que é o wireframe em HTML puro. O consentimento começa negado
 * (src/lib/tracking/gtm.ts); aqui a pessoa escolhe, a escolha fica no
 * localStorage e vai para o GTM com gtag('consent', 'update', …).
 *
 * window.anlnConsent.open() reabre o aviso (link "Preferências de cookies").
 */
(function () {
  var KEY = "anln_consent";
  var ID = "anln-consent";

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function decide(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {}
    var state = value === "granted" ? "granted" : "denied";
    gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    window.dataLayer.push({ event: "anln_consent_" + state });
    close();
  }

  function close() {
    var el = document.getElementById(ID);
    if (el) el.parentNode.removeChild(el);
  }

  function open() {
    if (document.getElementById(ID)) return;
    var box = document.createElement("div");
    box.id = ID;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Aviso de cookies");
    box.innerHTML =
      '<p class="anln-consent__text">Usamos cookies para entender como o site é usado e ' +
      "melhorar a sua experiência. Você escolhe. " +
      '<a href="/politica-de-privacidade">Política de Privacidade</a></p>' +
      '<div class="anln-consent__actions">' +
      '<button type="button" class="anln-consent__btn anln-consent__btn--ghost" data-choice="denied">Recusar</button>' +
      '<button type="button" class="anln-consent__btn" data-choice="granted">Aceitar</button>' +
      "</div>";
    box.addEventListener("click", function (ev) {
      var choice = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-choice");
      if (choice) decide(choice);
    });
    document.body.appendChild(box);
  }

  window.anlnConsent = { open: open };

  function start() {
    if (!read()) open();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
