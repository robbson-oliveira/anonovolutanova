"use client";

import { useEffect, useState } from "react";

/**
 * Lê o valor resolvido das métricas do degrau direto do CSSOM.
 *
 * Não dá para imprimir o valor de uma custom property com CSS, e escrever os
 * números à mão faria a página divergir dos tokens no primeiro ajuste — que é
 * exatamente o que esta página existe para impedir.
 */
export function Metrics({ token }: { token: string }) {
  const [vals, setVals] = useState<[string, string][]>([]);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const read = (suffix: string) => cs.getPropertyValue(`${token}${suffix}`).trim();
    setVals(
      ([
        ["", read("")],
        ["peso", read("--font-weight")],
        ["entrelinha", read("--line-height")],
        ["tracking", read("--letter-spacing")],
      ] as [string, string][]).filter(([, v]) => v),
    );
  }, [token]);

  if (!vals.length) return null;
  return (
    <dl className="space-y-0.5">
      {vals.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-2 md:justify-end">
          {k ? <dt className="text-text-muted/70">{k}</dt> : null}
          <dd className="text-text-muted">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
