import { Toaster } from "@ds/index";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { CartProvider } from "@/features/cart/CartProvider";

/**
 * Páginas da loja (a home, com a seção de produto, e o /checkout):
 * compartilham o carrinho. As institucionais ficam de fora e não criam sessão
 * no WooCommerce.
 */
export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <Toaster />
    </CartProvider>
  );
}
