"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/CartProvider";
import { WhatsAppChat } from "@/features/coming-soon/WhatsAppChat";

/**
 * Only the chat panel uses Inter. Declared here, not in the root layout, so
 * pages without the widget do not download it. `block` matches the teaser:
 * the panel waits for the face instead of painting a fallback.
 */
const interCss =
  `@font-face{font-family:"Inter";font-style:normal;font-weight:400 500;` +
  `font-display:block;src:url("/fonts/inter-latin-variable.woff2") format("woff2")}`;

function subscribeMenu(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-anln-menu"],
  });
  return () => obs.disconnect();
}

function menuOpen() {
  return document.documentElement.dataset.anlnMenu === "1";
}

/**
 * The Em breve WhatsApp chat on the storefront (home and cart). The checkout
 * hides it, and so do the cart drawer and the phone menu, so it never sits
 * on those controls. The button itself clears sticky bottom bars.
 */
export function StorefrontChat() {
  const pathname = usePathname();
  const { drawerOpen } = useCart();
  const menu = useSyncExternalStore(subscribeMenu, menuOpen, () => false);
  const checkout = pathname === "/checkout" || pathname.startsWith("/checkout/");

  return (
    <>
      <style href="anln-whatsapp-inter" precedence="default">
        {interCss}
      </style>
      <WhatsAppChat placement="storefront" hidden={checkout || drawerOpen || menu} />
    </>
  );
}
