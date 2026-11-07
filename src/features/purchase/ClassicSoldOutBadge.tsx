/**
 * Small mark beside the classic edition's name. It does not read stock and
 * does not block the choice or the purchase.
 */
export function ClassicSoldOutBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-pill border border-border bg-surface-muted px-2 py-0.5 text-[11px] font-semibold leading-4 text-text-muted">
      Esgotado
    </span>
  );
}
