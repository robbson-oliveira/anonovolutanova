/**
 * O que já foi preenchido nas etapas anteriores, com "Editar" para voltar —
 * o quadro "Contato / Entrega / Frete" da referência.
 */
export function ReviewCard({
  rows,
}: {
  rows: Array<{ label: string; content: React.ReactNode; onEdit: () => void }>;
}) {
  return (
    <div className="divide-y divide-border rounded-card border border-border bg-surface-plain">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-4 px-4 py-4 sm:px-5">
          <span className="w-16 shrink-0 text-field text-text-muted sm:w-20">{row.label}</span>
          <div className="min-w-0 flex-1 text-field break-words text-text-strong">{row.content}</div>
          <button
            type="button"
            onClick={row.onEdit}
            className="shrink-0 cursor-pointer text-field text-action underline-offset-4 hover:underline"
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}
