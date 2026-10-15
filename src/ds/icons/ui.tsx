import { IconBase, type IconProps } from "./Icon";

/* -----------------------------------------------------------------------------
   Ícones de interface, todos no grid 16x16.

   Sparkle e seta vêm do design aprovado — viviam em background-image do
   wireframe, em versão branca para fundo escuro; o fill virou currentColor
   para servirem nos dois fundos. Os outros quatro não existiam: o protótipo
   usava os caracteres +, ‹, › e ✓ como texto, e foram desenhados neste mesmo
   grid para casar com o peso dos extraídos.
   -------------------------------------------------------------------------- */

const UI_BOX = "0 0 16 16";

/** Selo de destaque: "Edição Limitada", "Envio Imediato!". Do design aprovado. */
export function IconSparkle(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="M10.23 7.46A1.9 1.9 0 0 1 8.68 5.9L8 2.3l-.68 3.6a1.9 1.9 0 0 1-1.55 1.56l-3.61.68 3.6.68a1.95 1.95 0 0 1 1.56 1.55l.68 3.6.68-3.6a1.9 1.9 0 0 1 1.55-1.55l3.61-.68Zm-6.77 5.87a.65.65 0 1 0-1.3 0 .65.65 0 0 0 1.3 0m9.08-9.09V3.6h-.65a.65.65 0 1 1 0-1.3h.65v-.65a.65.65 0 1 1 1.3 0v.65h.65a.65.65 0 1 1 0 1.3h-.65v.65a.65.65 0 0 1-1.3 0m-7.78 9.09a1.95 1.95 0 1 1-3.9 0 1.95 1.95 0 0 1 3.9 0m10.38-5.2a1.3 1.3 0 0 1-1.06 1.28l-3.6.69a.7.7 0 0 0-.52.51l-.69 3.6a1.3 1.3 0 0 1-2.54.01l-.69-3.6a.7.7 0 0 0-.51-.52L1.92 9.4a1.3 1.3 0 0 1 0-2.55l3.6-.68a.7.7 0 0 0 .52-.52l.68-3.6A1.3 1.3 0 0 1 8 1a1.3 1.3 0 0 1 1.28 1.06l.68 3.6a.6.6 0 0 0 .42.5l.1.02 3.6.68a1.3 1.3 0 0 1 1.06 1.28"/>
    </IconBase>
  );
}

/** Seta do CTA do cabeçalho. Do design aprovado. */
export function IconArrowRight(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="m14.03 8.53-4.5 4.5a.76.76 0 0 1-1.06 0 .75.75 0 0 1 0-1.06l3.22-3.22H2.5A.75.75 0 0 1 1.75 8a.75.75 0 0 1 .75-.75h9.19L8.47 4.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.7.7 0 0 1 .16.82q-.05.13-.16.24"/>
    </IconBase>
  );
}

/** Confirmado */
export function IconCheck(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M3.2 8.4 6.3 11.6 12.8 4.8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Abrir */
export function IconPlus(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M8 3.4v9.2M3.4 8h9.2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Diminuir — par do IconPlus no seletor de quantidade, mesmo traço. */
export function IconMinus(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M3.4 8h9.2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Anterior */
export function IconChevronLeft(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M9.9 3.6 5.5 8l4.4 4.4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Próximo */
export function IconChevronRight(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M6.1 3.6 10.5 8l-4.4 4.4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Avaliação */
export function IconStar(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="M8 .8l1.68 4.89 5.17.09-4.14 3.1 1.52 4.94L8 10.85l-4.23 2.97 1.52-4.94-4.14-3.1 5.17-.09z" />
    </IconBase>
  );
}

/*
 * Área do cliente, esteira de frete grátis e o fechar dela: extraídos do
 * wireframe aprovado (auditoria de header/topbar). O ícone da conta é
 * levemente retangular (23×24 no original) — mantido no viewBox nativo em
 * vez de forçado no grid 16×16, para não distorcer a proporção.
 */

/** Área do cliente */
export function IconAccount(props: IconProps) {
  return (
    <IconBase viewBox="0 0 23 24" fill="none" {...props}>
      <path fill="transparent" d="M.07 24V0h22.857v24Z" />
      <path
        fill="currentColor"
        d="M11.068 13.091c3.694 0 6.7-2.937 6.7-6.546S14.762 0 11.068 0C7.379.005 4.374 2.941 4.369 6.545c0 3.609 3.005 6.546 6.699 6.546m0-11.198c2.63.003 4.772 2.09 4.775 4.652 0 2.566-2.142 4.652-4.775 4.652-2.632 0-4.773-2.086-4.773-4.652 0-2.565 2.141-4.651 4.773-4.652m5.459 13.497H5.61c-3.057.003-5.548 2.437-5.551 5.425v2.239c0 .522.432.946.963.946s.962-.424.962-.946v-2.239c.003-1.945 1.63-3.53 3.626-3.532h10.917c1.997.002 3.624 1.587 3.627 3.532v2.239c0 .522.432.946.962.946a.955.955 0 0 0 .963-.946v-2.239c-.003-2.988-2.494-5.422-5.552-5.425"
      />
    </IconBase>
  );
}

/** Fechar a esteira de frete grátis */
export function IconClose(props: IconProps) {
  return (
    <IconBase viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="transparent"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.75 12A7.25 7.25 0 0 1 12 4.75h0A7.25 7.25 0 0 1 19.25 12h0A7.25 7.25 0 0 1 12 19.25h0A7.25 7.25 0 0 1 4.75 12m5-2.25 4.5 4.5m0-4.5-4.5 4.5"
      />
    </IconBase>
  );
}

/** Separador da esteira: asterisco, alterna com o pacote entre as repetições. */
export function IconAsterisk(props: IconProps) {
  return (
    <IconBase fill="none" {...props}>
      <path
        fill="currentColor"
        d="M57.584 40.011 41.218 30l16.365-10.011a1.244 1.244 0 0 0 .412-1.712l-4.809-7.861a1.24 1.24 0 0 0-1.712-.413L35.852 19.56V1.246C35.852.558 35.294 0 34.606 0h-9.213c-.688 0-1.246.558-1.246 1.246V19.56L8.525 10.004a1.245 1.245 0 0 0-1.713.413l-4.808 7.86a1.25 1.25 0 0 0 .412 1.713L18.781 30 2.416 40.011a1.24 1.24 0 0 0-.412 1.712l4.808 7.86a1.245 1.245 0 0 0 1.713.414l15.622-9.557v18.314c0 .688.558 1.246 1.246 1.246h9.213c.688 0 1.246-.558 1.246-1.246V40.441l15.622 9.555a1.246 1.246 0 0 0 1.713-.412l4.809-7.861a1.25 1.25 0 0 0-.412-1.712"
      />
    </IconBase>
  );
}

/**
 * Separador da esteira: a caixa. Única exceção ao contrato de currentColor
 * do resto do sistema — é uma ilustração colorida de propósito (6 tons
 * extraídos do wireframe aprovado), não um glifo. Repintar por herança
 * destruiria o sombreado 3D que dá a leitura de caixa/pacote. Os tons são os
 * tokens --color-illus-gift-* (tokens.css), para mudarem com a paleta.
 */
export function IconGiftBox(props: IconProps) {
  return (
    <IconBase fill="none" {...props}>
      <g fill="transparent">
        <path className="fill-illus-gift-light" d="M28.526.366 5.374 12.657a1.97 1.97 0 0 0-1.044 1.736v30.853c0 1.246.7 2.386 1.812 2.95l22.704 11.515c.724.368 1.58.368 2.304 0l22.705-11.515a3.31 3.31 0 0 0 1.811-2.95V14.393c0-.727-.401-1.395-1.044-1.736L31.47.366a3.14 3.14 0 0 0-2.944 0" />
        <path className="fill-illus-gift-side" d="M29.913 60c.395 0 .79-.092 1.152-.276L53.77 48.209a3.31 3.31 0 0 0 1.811-2.95V14.406a1.95 1.95 0 0 0-.225-.904L29.913 27.053Z" />
        <path className="fill-illus-gift-shade" d="M29.998 27.054 4.555 13.502a1.95 1.95 0 0 0-.225.904v30.852c0 1.247.7 2.387 1.812 2.951l22.704 11.515c.357.181.751.276 1.152.276z" />
        <path className="fill-illus-gift-ribbon" d="m39.014 4.365-25.75 13.713v4.388c0 .421.232.808.604 1.006l4.475 2.385a.533.533 0 0 0 .784-.47v-4.096L44.916 7.498Z" />
        <path className="fill-illus-gift-detail" d="m33.669 51.241 6.869-3.285a2.48 2.48 0 0 0 1.408-2.293l-.001-.03a1.09 1.09 0 0 0-1.588-.944l-6.688 3.434zm0 4.791 3.772-1.753a2.48 2.48 0 0 0 1.433-2.304 1.09 1.09 0 0 0-1.594-.942l-3.611 1.88Z" />
        <path className="fill-illus-gift-ribbon-shade" d="M13.264 18.172v4.344c0 .421.232.808.604 1.006l4.475 2.385a.533.533 0 0 0 .784-.47v-4.096l.043-.023Z" />
      </g>
    </IconBase>
  );
}

/* -----------------------------------------------------------------------------
   Ícones de formulário e checkout. Desenhados no grid 16x16 com o mesmo traço
   de 1.5 dos glifos acima (IconPlus, IconCheck), para casar com eles. Não
   existiam no wireframe: a landing não tem formulário.
   -------------------------------------------------------------------------- */

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

/** E-mail (campo de e-mail) */
export function IconMail(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" {...STROKE} />
      <path d="m2.6 4.6 5.4 4 5.4-4" {...STROKE} />
    </IconBase>
  );
}

/** Telefone (campo de telefone) */
export function IconPhone(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        d="M5.2 2.5H3.8a1.3 1.3 0 0 0-1.3 1.4c.5 5.1 4.5 9.1 9.6 9.6a1.3 1.3 0 0 0 1.4-1.3v-1.4a1 1 0 0 0-.7-1l-1.9-.6a1 1 0 0 0-1 .3l-.7.8a7.5 7.5 0 0 1-3.5-3.5l.8-.7a1 1 0 0 0 .3-1l-.6-1.9a1 1 0 0 0-1-.7Z"
        {...STROKE}
      />
    </IconBase>
  );
}

/** Data (campo de data) */
export function IconCalendar(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" {...STROKE} />
      <path d="M2.5 6.8h11M5.5 2v3M10.5 2v3" {...STROKE} />
    </IconBase>
  );
}

/** Carrinho (cabeçalho do resumo do pedido) */
export function IconBasket(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M1.8 6.5h12.4l-1.3 6.1a1.3 1.3 0 0 1-1.3 1H4.4a1.3 1.3 0 0 1-1.3-1Z" {...STROKE} />
      <path d="M5.2 6.5 7 2.5m3.8 4L9 2.5M6 9.2v2m2-2v2m2-2v2" {...STROKE} />
    </IconBase>
  );
}

/** Pagamento seguro (botão "Pagar") */
export function IconLock(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <rect x="3.2" y="7" width="9.6" height="6.8" rx="1.3" {...STROKE} />
      <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" {...STROKE} />
    </IconBase>
  );
}

/** Endereço */
export function IconMapPin(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M8 14.2s4.6-4 4.6-7.6a4.6 4.6 0 0 0-9.2 0c0 3.6 4.6 7.6 4.6 7.6Z" {...STROKE} />
      <circle cx="8" cy="6.6" r="1.6" {...STROKE} />
    </IconBase>
  );
}

/** Entrega (formas de entrega) */
export function IconPackage(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M8 1.8 13.6 4.8v6.4L8 14.2l-5.6-3V4.8Z" {...STROKE} />
      <path d="M2.6 4.9 8 7.8l5.4-2.9M8 7.8v6.2M5.2 3.3l5.5 3" {...STROKE} />
    </IconBase>
  );
}

/** Frete (selo de frete grátis, estimativa de entrega). As rodas interrompem
 *  a linha do chão para o traço não atravessar os círculos. */
export function IconTruck(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M9.4 11.2v-7H1.8v7h1.4M5.9 11.2h4.3M9.4 6.4h2.5l2.3 2.5v2.3h-1.3" {...STROKE} />
      <circle cx="4.55" cy="11.2" r="1.35" {...STROKE} />
      <circle cx="11.55" cy="11.2" r="1.35" {...STROKE} />
    </IconBase>
  );
}

/** Cartão de crédito */
export function IconCreditCard(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.5" {...STROKE} />
      <path d="M1.8 6.6h12.4M4.5 10.2H7" {...STROKE} />
    </IconBase>
  );
}

/**
 * Pix: the official Banco Central symbol, used as-is (already on the 16x16
 * grid) rather than redrawn, since the mark must not be altered. Kept in
 * currentColor: the brand manual allows single-color versions.
 */
export function IconPix(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        fill="currentColor"
        d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"
      />
      <path
        fill="currentColor"
        d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"
      />
    </IconBase>
  );
}

/** Voltar */
export function IconArrowLeft(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M13 8H3m4-4L3 8l4 4" {...STROKE} />
    </IconBase>
  );
}

/** Abrir para cima (barra do resumo no celular) */
export function IconChevronUp(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M3.6 9.9 8 5.5l4.4 4.4" {...STROKE} />
    </IconBase>
  );
}

/** Abrir para baixo (seletor de lista). Par do IconChevronUp, mesmo traço. */
export function IconChevronDown(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M3.6 6.1 8 10.5l4.4-4.4" {...STROKE} />
    </IconBase>
  );
}

/** Boleto: o código de barras, em traços de larguras diferentes. */
export function IconBarcode(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M2.2 3.5v9M4.4 3.5v9M7.3 3.5v9M9.4 3.5v9M13.8 3.5v9" {...STROKE} />
      <path d="M11.6 3.5v9" {...STROKE} strokeWidth={2.4} strokeLinecap="butt" />
    </IconBase>
  );
}

/** Forma de pagamento genérica (carteira): quando o gateway não publica imagem. */
export function IconWallet(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M12.6 5.2V3.9a1.1 1.1 0 0 0-1.1-1.1H3.3a1.5 1.5 0 0 0-1.5 1.5v7.9a1.5 1.5 0 0 0 1.5 1.5h9.4a1.5 1.5 0 0 0 1.5-1.5V6.7a1.5 1.5 0 0 0-1.5-1.5H3.3a1.5 1.5 0 0 1-1.5-1.5" {...STROKE} />
      <circle cx="11.2" cy="9.4" r="0.8" fill="currentColor" />
    </IconBase>
  );
}

/** Copy (Pix copy-and-paste code): two stacked sheets. */
export function IconCopy(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <rect x="5.4" y="5.4" width="8.4" height="8.4" rx="1.4" {...STROKE} />
      <path d="M10.6 5.4V3.6a1.4 1.4 0 0 0-1.4-1.4H3.6a1.4 1.4 0 0 0-1.4 1.4v5.6a1.4 1.4 0 0 0 1.4 1.4h1.8" {...STROKE} />
    </IconBase>
  );
}

/** Waiting (payment not confirmed yet): a clock face. */
export function IconClock(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <circle cx="8" cy="8" r="6.2" {...STROKE} />
      <path d="M8 4.6V8l2.3 1.5" {...STROKE} />
    </IconBase>
  );
}

/** Help / customer service: a headset. */
export function IconHeadset(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M2.4 10V8a5.6 5.6 0 0 1 11.2 0v2" {...STROKE} />
      <rect x="2.2" y="8.8" width="2.8" height="4" rx="1" {...STROKE} />
      <rect x="11" y="8.8" width="2.8" height="4" rx="1" {...STROKE} />
      <path d="M12.4 12.8v.2a1.6 1.6 0 0 1-1.6 1.6H8.6" {...STROKE} />
    </IconBase>
  );
}

/** Opens in a new tab (boleto link). */
export function IconExternal(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M9.4 2.4h4.2v4.2M13.4 2.6 7.6 8.4" {...STROKE} />
      <path d="M12 9.6v2.8a1.4 1.4 0 0 1-1.4 1.4H3.6a1.4 1.4 0 0 1-1.4-1.4V5.4A1.4 1.4 0 0 1 3.6 4h2.8" {...STROKE} />
    </IconBase>
  );
}

/**
 * WhatsApp. Glyph of the floating chat button of the "Em breve" page
 * (33 × 34 in the Framer export), scaled into the 16 grid.
 */
export function IconWhatsApp(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        fill="currentColor"
        transform="translate(0.235 0) scale(0.47046)"
        d="M 28.202 4.938 C 25.122 1.771 20.938 -0.006 16.577 0 C 7.499 0 0.138 7.547 0.138 16.858 C 0.138 19.957 0.953 22.859 2.374 25.354 L 2.332 25.274 L 0 34.009 L 8.713 31.665 C 10.982 32.957 13.688 33.716 16.567 33.716 L 16.574 33.716 C 25.652 33.713 33.01 26.165 33.01 16.855 C 33.016 12.385 31.285 8.097 28.2 4.939 Z M 16.574 30.869 L 16.567 30.869 C 14.003 30.869 11.603 30.143 9.554 28.881 L 9.616 28.916 L 9.117 28.613 L 3.947 30.005 L 5.326 24.834 L 5.001 24.305 C 3.629 22.077 2.904 19.494 2.912 16.859 C 2.912 9.123 9.029 2.85 16.573 2.85 C 24.117 2.85 30.234 9.123 30.234 16.859 C 30.234 24.596 24.119 30.869 16.573 30.869 Z M 24.068 20.377 C 23.657 20.166 21.638 19.149 21.262 19.007 C 20.885 18.867 20.611 18.798 20.336 19.219 C 20.064 19.64 19.277 20.588 19.037 20.87 C 18.798 21.152 18.557 21.186 18.147 20.976 C 16.932 20.478 15.81 19.767 14.832 18.876 L 14.843 18.886 C 13.962 18.05 13.203 17.087 12.591 16.027 L 12.56 15.968 C 12.321 15.547 12.534 15.319 12.739 15.109 C 12.924 14.921 13.15 14.617 13.355 14.372 C 13.516 14.169 13.655 13.937 13.76 13.687 L 13.766 13.668 C 13.879 13.431 13.865 13.152 13.73 12.927 L 13.732 12.931 C 13.628 12.72 12.807 10.647 12.466 9.803 C 12.132 8.982 11.792 9.094 11.541 9.081 C 11.302 9.069 11.028 9.067 10.754 9.067 C 10.317 9.078 9.929 9.28 9.661 9.592 L 9.66 9.594 C 8.719 10.507 8.197 11.784 8.223 13.112 L 8.223 13.108 C 8.358 14.704 8.945 16.224 9.912 17.482 L 9.899 17.465 C 11.643 20.136 14.022 22.308 16.812 23.775 L 16.916 23.824 C 17.522 24.105 18.298 24.406 19.092 24.663 L 19.257 24.71 C 20.105 24.974 21.003 25.029 21.876 24.872 L 21.841 24.876 C 22.99 24.635 23.989 23.917 24.603 22.893 L 24.613 22.873 C 24.883 22.237 24.966 21.534 24.85 20.85 L 24.853 20.872 C 24.751 20.696 24.477 20.592 24.065 20.38 Z"
      />
    </IconBase>
  );
}

/** Send (paper plane), for chat inputs. */
export function IconSend(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        fill="currentColor"
        transform="scale(0.0625)"
        d="M228.992 146.827 48.594 250.051c-17.497 9.998-38.04-7.264-31.166-26.206l34.642-95.842L17.428 32.16C10.554 13.178 31.097-4.045 48.594 5.953l180.398 103.224c14.606 8.319 14.568 29.331 0 37.65z"
      />
    </IconBase>
  );
}

/** Smiling face, for emoji pickers (the Framer chat widget's, 24 grid scaled to 16). */
export function IconSmile(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        fill="currentColor"
        transform="scale(0.66667)"
        d="M12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM15.5 8C15.8978 8 16.2794 8.15804 16.5607 8.43934C16.842 8.72064 17 9.10218 17 9.5C17 9.89782 16.842 10.2794 16.5607 10.5607C16.2794 10.842 15.8978 11 15.5 11C15.1022 11 14.7206 10.842 14.4393 10.5607C14.158 10.2794 14 9.89782 14 9.5C14 9.10218 14.158 8.72064 14.4393 8.43934C14.7206 8.15804 15.1022 8 15.5 8ZM8.5 8C8.89782 8 9.27936 8.15804 9.56066 8.43934C9.84196 8.72064 10 9.10218 10 9.5C10 9.89782 9.84196 10.2794 9.56066 10.5607C9.27936 10.842 8.89782 11 8.5 11C8.10218 11 7.72064 10.842 7.43934 10.5607C7.15804 10.2794 7 9.89782 7 9.5C7 9.10218 7.15804 8.72064 7.43934 8.43934C7.72064 8.15804 8.10218 8 8.5 8ZM12 17.5C9.67 17.5 7.69 16.04 6.89 14H17.11C16.3 16.04 14.33 17.5 12 17.5Z"
      />
    </IconBase>
  );
}
