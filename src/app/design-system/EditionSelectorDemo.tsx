"use client";

import { useState } from "react";
import { EditionSelector } from "@ds/index";
import { AGENDA_EDITIONS } from "@content/product";

/** O seletor é controlado; a página do DS precisa de um dono para o estado. */
export function EditionSelectorDemo() {
  const [value, setValue] = useState<string>(AGENDA_EDITIONS[0].id);
  const [paused, setPaused] = useState(false);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <EditionSelector
        options={AGENDA_EDITIONS}
        value={value}
        onChange={setValue}
        paused={paused}
      />
    </div>
  );
}
