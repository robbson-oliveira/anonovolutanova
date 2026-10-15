"use client";

/** Full-screen progress feedback that keeps the pending action modal. */
import * as Dialog from "@radix-ui/react-dialog";

type ProcessingOverlayProps = {
  open: boolean;
  label: string;
};

/** Prevent interaction while a request completes, including route navigation. */
export function ProcessingOverlay({ open, label }: ProcessingOverlayProps) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed inset-0 z-2147483001 flex items-center justify-center bg-surface-plain/80 px-4 backdrop-blur-md outline-none motion-safe:animate-processing-enter"
        >
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-5 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              className="size-16 text-action md:size-20"
            >
              <circle cx="12" cy="12" r="9.5" opacity="0.1" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="9.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="42 150"
                className="origin-center motion-safe:animate-processing-ring"
              />
            </svg>
            <Dialog.Title className="text-field font-medium text-text-strong md:text-sm">
              {label}
            </Dialog.Title>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
