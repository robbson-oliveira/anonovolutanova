import { IconCheck, cn } from "@ds/index";
import { STEPS, type Step } from "./state";

/**
 * Checkout steps, following the reference: a small "ETAPA N" above the name,
 * a filled green circle with a check on completed steps, a ring with a dot on
 * the current one, an empty ring on the next ones, and a dashed line between
 * them. Completed steps become buttons, so the shopper can go back and fix.
 */
export function Stepper({ current, onGo }: { current: Step; onGo: (step: Step) => void }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex w-full max-w-[500px] items-center" aria-label="Etapas do checkout">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const content = (
          <>
            <span
              aria-hidden
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-pill",
                done && "bg-success text-on-success",
                active && "border-2 border-action",
                !done && !active && "border-2 border-border",
              )}
            >
              {done ? <IconCheck /> : active ? <span className="size-3 rounded-pill bg-action" /> : null}
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="hidden text-caption text-text-muted uppercase sm:inline">Etapa {i + 1}</span>
              <span
                className={cn(
                  "text-label font-semibold",
                  done || active ? "text-text-strong" : "text-text-muted",
                  // No celular não cabem os três nomes: fica o da etapa atual.
                  !active && "max-sm:sr-only",
                )}
              >
                {s.label}
              </span>
            </span>
          </>
        );
        return (
          <li
            key={s.key}
            className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}
            aria-current={active ? "step" : undefined}
          >
            {done ? (
              <button type="button" onClick={() => onGo(s.key)} className="flex shrink-0 cursor-pointer items-center gap-2 sm:gap-2.5">
                {content}
              </button>
            ) : (
              <span className="flex shrink-0 items-center gap-2 sm:gap-2.5">{content}</span>
            )}
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="mx-2 h-px min-w-3 flex-1 sm:mx-3 border-t border-dashed border-border" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
