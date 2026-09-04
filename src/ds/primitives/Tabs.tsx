"use client";

import { useId, useState } from "react";
import { cn } from "@ds/utils/cn";

export type TabItem = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  className?: string;
};

export function Tabs({ items, className }: TabsProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Seções da agenda"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.label}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "cursor-pointer rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors",
                "[transition-duration:var(--duration-fast)]",
                selected
                  ? "bg-surface-inverse text-text-on-inverse"
                  : "border border-border bg-surface-plain text-text hover:border-action hover:text-action",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, i) => (
        <div
          key={item.label}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          className="mt-10"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
