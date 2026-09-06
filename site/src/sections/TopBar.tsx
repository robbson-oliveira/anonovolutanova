import { Marquee } from "@ds/index";
import { SHIPPING_NOTICE } from "@content/product";

/**
 * Barra fixa do topo, 36px. A altura é reservada pelo `pt-9` do shell da
 * página — a barra é `fixed` e sairia do fluxo, sobrepondo o header.
 */
export function TopBar() {
  const items = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="text-xs font-medium text-text-on-inverse">
      {SHIPPING_NOTICE}
    </span>
  ));

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-9 items-center bg-surface-inverse">
      <Marquee items={items} gap={28} className="w-full" />
    </div>
  );
}
