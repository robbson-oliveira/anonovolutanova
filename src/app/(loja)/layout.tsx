import { Toaster } from "@ds/index";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { CartProvider } from "@/features/cart/CartProvider";
import { StorefrontChat } from "@/features/shell/StorefrontChat";

/**
 * Store pages (the home, the cart and the checkout) share one cart. Institutional
 * pages stay outside this layout and do not open a WooCommerce session. The
 * WhatsApp chat is mounted here and hides itself on the checkout.
 */
export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <Toaster />
      <StorefrontChat />
    </CartProvider>
  );
}
