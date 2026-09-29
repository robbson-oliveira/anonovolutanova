"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { IconChevronDown, IconSend, IconSmile, IconWhatsApp, cn } from "@ds/index";
import { CHAT_EMOJIS, COMING_SOON_CHAT } from "@content/coming-soon";
import { publicEnv } from "@/lib/env";

const TIME = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** The same link the Framer widget opens: WhatsApp with the message written. */
const whatsappSendUrl = (text: string) =>
  `https://api.whatsapp.com/send/?phone=${publicEnv.whatsappChatNumber}` +
  `&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;

/**
 * The chat widget in the corner of the "Em breve" page, as in the Framer
 * teaser: a floating WhatsApp button that opens a small conversation panel.
 * What the visitor types (emoji picker included) opens WhatsApp with the
 * message already written, to NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER.
 *
 * Measurements from the live page: 312 × 397 panel, doodle wallpaper at 7%
 * over the sand background, 56px button, 50px from the corner on desktop,
 * 40/36 on tablet and 30/26 on the phone.
 */
export function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  // The greeting shows the time the panel opened, like a message just sent.
  const [time, setTime] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [group, setGroup] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  // Where the caret was when the input lost focus to the picker.
  const caret = useRef(0);
  const panelId = useId();
  const pickerId = useId();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      // Escape closes the picker first, then the panel.
      setPickerOpen((picker) => {
        if (!picker) setOpen(false);
        return false;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (ev: MouseEvent) => {
      const target = ev.target as Node;
      if (!pickerRef.current?.contains(target) && !emojiButtonRef.current?.contains(target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  const toggle = () => {
    if (!open) setTime(TIME.format(new Date()));
    setOpen((v) => !v);
    setPickerOpen(false);
  };

  const rememberCaret = () => {
    caret.current = inputRef.current?.selectionStart ?? message.length;
  };

  const insertEmoji = (emoji: string) => {
    const at = Math.min(caret.current, message.length);
    setMessage(message.slice(0, at) + emoji + message.slice(at));
    caret.current = at + emoji.length;
    // Back to the input with the caret after the emoji, once React rendered it.
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(caret.current, caret.current);
    });
  };

  const send = (ev: React.FormEvent) => {
    ev.preventDefault();
    const text = message.trim();
    if (!text) return;
    window.open(whatsappSendUrl(text), "_blank", "noopener,noreferrer");
    setMessage("");
    setPickerOpen(false);
  };

  return (
    <div className="fixed right-[26px] bottom-[30px] z-40 flex flex-col items-end gap-4 font-inter animate-soon-float motion-reduce:animate-none md:right-9 md:bottom-10 min-[75rem]:right-[50px] min-[75rem]:bottom-[50px]">
      {open ? (
        <section
          id={panelId}
          aria-label={COMING_SOON_CHAT.title}
          className="relative flex h-[397px] w-[312px] max-w-[calc(100vw-52px)] origin-bottom-right animate-soon-panel flex-col overflow-hidden rounded-[10px] bg-whatsapp-panel shadow-whatsapp-panel motion-reduce:animate-none"
        >
          {/* WhatsApp's doodle wallpaper, barely there (7%, as measured). */}
          <Image
            src="/img/em-breve/whatsapp-fundo.png"
            alt=""
            fill
            sizes="312px"
            loading="eager"
            className="object-cover opacity-[0.07]"
          />

          <header className="relative flex h-[51px] shrink-0 items-center justify-between rounded-t-[10px] bg-whatsapp px-[18px] py-3">
            <span className="flex items-center gap-2.5">
              <Image src="/img/em-breve/whatsapp-selo.svg" alt="" width={27} height={27} unoptimized className="size-[27px]" />
              <span className="text-[13.6px] leading-[1.2] text-whatsapp-header-text">{COMING_SOON_CHAT.title}</span>
            </span>
            <button
              type="button"
              onClick={toggle}
              aria-label="Fechar conversa"
              className="grid size-6 cursor-pointer place-items-center text-[18px] text-on-whatsapp"
            >
              <IconChevronDown />
            </button>
          </header>

          <div className="relative flex-1 p-[18px]">
            <div className="relative flex items-start">
              <Image
                src="/img/em-breve/whatsapp-avatar.png"
                alt=""
                width={918}
                height={920}
                sizes="31px"
                className="size-[31px] shrink-0 rounded-[17px] object-cover"
              />
              {/* The bubble's tail, under its top-left corner. */}
              <svg aria-hidden viewBox="0 0 20 14" className="absolute top-0 left-[30px] h-[14px] w-5 fill-whatsapp-bubble">
                <path d="M20 0H0l20 14Z" />
              </svg>
              <div className="relative ml-[11px] flex w-[196px] flex-col rounded-lg bg-whatsapp-bubble pt-2 pr-[15px] pb-[7px] pl-4">
                <p className="text-[10.4px] leading-[1.2] font-medium text-whatsapp-sender">{COMING_SOON_CHAT.agent}</p>
                <p className="mt-0.5 text-[13.6px] leading-[1.2] font-medium text-whatsapp-text">{COMING_SOON_CHAT.greeting}</p>
                <p className="mt-0.5 pt-[3px] text-[10.4px] leading-none text-whatsapp-time">{time}</p>
              </div>
            </div>
          </div>

          <form onSubmit={send} className="relative flex shrink-0 items-center gap-3 p-[18px]">
            {pickerOpen ? (
              <div
                ref={pickerRef}
                id={pickerId}
                role="dialog"
                aria-label="Emojis"
                className="absolute bottom-[calc(100%-10px)] left-[18px] flex h-[250px] w-[276px] animate-soon-panel flex-col overflow-hidden rounded-[10px] bg-whatsapp-bubble shadow-whatsapp-panel motion-reduce:animate-none"
              >
                <div role="tablist" aria-label="Grupos de emojis" className="flex shrink-0 border-b border-border">
                  {CHAT_EMOJIS.map((g, i) => (
                    <button
                      key={g.label}
                      type="button"
                      role="tab"
                      aria-selected={i === group}
                      aria-label={g.label}
                      onClick={() => setGroup(i)}
                      className={cn(
                        "flex-1 cursor-pointer border-b-2 py-2 text-[18px] leading-none",
                        i === group ? "border-whatsapp" : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      {g.emojis[0]}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" aria-label={CHAT_EMOJIS[group].label} className="grid flex-1 auto-rows-min grid-cols-7 gap-0.5 overflow-y-auto p-2">
                  {CHAT_EMOJIS[group].emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      aria-label={`Inserir ${emoji}`}
                      className="grid aspect-square cursor-pointer place-items-center rounded-lg text-[22px] leading-none hover:bg-whatsapp-panel"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex h-[42px] min-w-0 flex-1 items-center gap-2.5 rounded-[30px] bg-whatsapp-bubble px-2.5 py-[9px] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-whatsapp">
              <button
                ref={emojiButtonRef}
                type="button"
                onMouseDown={rememberCaret}
                onClick={() => {
                  rememberCaret();
                  setPickerOpen((v) => !v);
                }}
                aria-label="Emojis"
                aria-expanded={pickerOpen}
                aria-controls={pickerOpen ? pickerId : undefined}
                className="grid size-6 shrink-0 cursor-pointer place-items-center text-[24px] text-whatsapp-idle transition-colors [transition-duration:var(--duration-fast)] hover:text-whatsapp-time"
              >
                <IconSmile />
              </button>
              <input
                ref={inputRef}
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                onSelect={rememberCaret}
                placeholder={COMING_SOON_CHAT.placeholder}
                aria-label="Sua mensagem"
                enterKeyHint="send"
                className="h-[22px] min-w-0 flex-1 bg-transparent text-[13px] leading-normal text-whatsapp-text outline-none placeholder:text-whatsapp-idle"
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Enviar pelo WhatsApp"
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill bg-whatsapp-send text-[22px] text-on-whatsapp transition-colors [transition-duration:var(--duration-fast)] hover:bg-whatsapp-send-hover disabled:cursor-not-allowed disabled:bg-whatsapp-idle"
            >
              <IconSend />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Fechar conversa no WhatsApp" : "Conversar no WhatsApp"}
        className="grid size-14 cursor-pointer place-items-center rounded-pill bg-whatsapp text-on-whatsapp shadow-whatsapp-button transition-transform [transition-duration:var(--duration-fast)] hover:scale-105"
      >
        {open ? (
          // Framer's close glyph: two 20px strokes, 3px wide, drawn past the box.
          <svg aria-hidden viewBox="0 0 20 20" className="size-5 overflow-visible">
            <path d="M20 0 0 20M0 0l20 20" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
          </svg>
        ) : (
          <IconWhatsApp className="text-[34px]" />
        )}
      </button>
    </div>
  );
}
