import { IconCheck, cn } from "@ds/index";
import { STEPS, type Step } from "./state";

/**
 * As três etapas. Etapas já feitas viram botão (para voltar e corrigir); as
 * seguintes só se alcançam avançando.
 */
export function Stepper({ current, onGo }: { current: Step; onGo: (step: Step) => void }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center gap-2" aria-label="Etapas do checkout">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const content = (
          <>
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-pill text-xs font-bold",
                done && "bg-action text-on-action",
                active && "border-2 border-action text-action",
                !done && !active && "border border-border text-text-muted",
              )}
            >
              {done ? <IconCheck /> : i + 1}
            </span>
            <span className={cn("text-sm font-semibold", active || done ? "text-text-strong" : "text-text-muted")}>
              {s.label}
            </span>
          </>
        );
        return (
          <li key={s.key} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            {done ? (
              <button type="button" onClick={() => onGo(s.key)} className="flex cursor-pointer items-center gap-2">
                {content}
              </button>
            ) : (
              <span className="flex items-center gap-2">{content}</span>
            )}
            {i < STEPS.length - 1 ? <span aria-hidden className="h-px flex-1 bg-border" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
