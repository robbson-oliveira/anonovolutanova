"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { IconClose } from "@ds/icons";

/**
 * Toast stack (sonner) skinned with the DS tokens: paper card, field text,
 * terracotta (`accent`) edge and icon for errors — the same tone the forms
 * use for their inline messages. Mount it once per layout and fire toasts
 * with the re-exported `toast` (`toast.error(title, { description })`).
 *
 * Top center on every screen: at the bottom it would land under the checkout's
 * mobile summary bar and the cookie banner.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      closeButton
      duration={8000}
      icons={{ close: <IconClose /> }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 rounded-card border border-border border-l-4 bg-surface-plain py-4 pr-11 pl-4 font-sans text-field text-text shadow-float",
          error: "border-l-accent",
          success: "border-l-success",
          icon: "mt-px flex shrink-0 [[data-type=error]_&]:text-accent [[data-type=success]_&]:text-success",
          content: "flex min-w-0 flex-col gap-1",
          title: "font-semibold text-text-strong",
          description: "text-text",
          closeButton:
            "absolute top-3 right-3 grid size-7 cursor-pointer place-items-center rounded-full text-text-muted hover:bg-surface-muted hover:text-text-strong focus-visible:outline-2 focus-visible:outline-action",
        },
      }}
    />
  );
}

export { toast };
