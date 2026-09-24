import { CartDrawer } from "@/features/cart/CartDrawer";
import { CartProvider } from "@/features/cart/CartProvider";

/**
 * Páginas da loja (/comprar, /checkout): compartilham o carrinho. As
 * institucionais e o wireframe ficam de fora e não criam sessão no WooCommerce.
 */
export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
