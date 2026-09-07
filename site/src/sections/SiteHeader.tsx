"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Container, IconAccount, IconArrowRight, cn } from "@ds/index";
import { NAV_LINKS } from "@content/home";
import { CHECKOUT_URL, PRODUCT_NAME } from "@content/product";
import logo from "@/public/img/logo.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    // Não é sticky: no design aprovado o cabeçalho rola junto com a página.
    // Só a barra de frete fica fixa no topo. Sem borda embaixo — o wireframe
    // não tem nenhuma (0px em toda a cadeia de elementos, conferido no DOM).
    <header className="relative z-40 bg-surface">
      {/* 1316px, a MESMA medida do texto do Hero (Hero.tsx), não os 1200px
          do container de conteúdo do resto do site nem um valor próprio do
          header. O logo precisa cair exatamente na borda esquerda do bloco
          de texto — por isso aqui usa a receita idêntica de Hero.tsx
          (max-w-[1316px] + px-6 lg:px-0), não a antiga (1390px + padding
          fixo) que deixava o logo ~23px à direita do texto. */}
      <div className="mx-auto flex h-20 w-full max-w-[1316px] items-center justify-between gap-6 px-6 lg:px-0">
        <Link href="#inicio" className="flex shrink-0 items-center">
          <Image
            src={logo}
            alt={PRODUCT_NAME}
            priority
            className="w-auto"
            style={{ height: "72px", width: "auto" }}
          />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-bold text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#conta"
            aria-label="Área do cliente"
            className="hidden size-11 place-items-center rounded-pill text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:text-accent lg:grid"
          >
            <IconAccount className="text-xl" />
          </Link>
          {/* shape="block": medido no wireframe, radius=12px (rounded-card),
              não pílula. O padrão do Button é pílula para botão de nav — este
              é a exceção confirmada, não os outros que ainda não medi. */}
          <Button href={CHECKOUT_URL} size="md" shape="block">
            Comprar
            <IconArrowRight />
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 cursor-pointer place-items-center rounded-pill border border-border lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="text-lg leading-none text-text-strong">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      <div className={cn("lg:hidden", !open && "hidden")}>
        <Container className="pb-6">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}
