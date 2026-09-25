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
 * do resto do sistema — é uma ilustração colorida de propósito (6 tons fixos,
 * extraídos do wireframe aprovado), não um glifo. Repintar por herança
 * destruiria o sombreado 3D que dá a leitura de caixa/pacote.
 */
/* eslint-disable no-restricted-syntax -- exceção documentada acima: cores
   fixas da ilustração extraída do wireframe, não tokens de marca. */
export function IconGiftBox(props: IconProps) {
  return (
    <IconBase fill="none" {...props}>
      <g fill="transparent">
        <path fill="#FFCE94" d="M28.526.366 5.374 12.657a1.97 1.97 0 0 0-1.044 1.736v30.853c0 1.246.7 2.386 1.812 2.95l22.704 11.515c.724.368 1.58.368 2.304 0l22.705-11.515a3.31 3.31 0 0 0 1.811-2.95V14.393c0-.727-.401-1.395-1.044-1.736L31.47.366a3.14 3.14 0 0 0-2.944 0" />
        <path fill="#FCB043" d="M29.913 60c.395 0 .79-.092 1.152-.276L53.77 48.209a3.31 3.31 0 0 0 1.811-2.95V14.406a1.95 1.95 0 0 0-.225-.904L29.913 27.053Z" />
        <path fill="#E2791B" d="M29.998 27.054 4.555 13.502a1.95 1.95 0 0 0-.225.904v30.852c0 1.247.7 2.387 1.812 2.951l22.704 11.515c.357.181.751.276 1.152.276z" />
        <path fill="#DEF2FC" d="m39.014 4.365-25.75 13.713v4.388c0 .421.232.808.604 1.006l4.475 2.385a.533.533 0 0 0 .784-.47v-4.096L44.916 7.498Z" />
        <path fill="#403A46" d="m33.669 51.241 6.869-3.285a2.48 2.48 0 0 0 1.408-2.293l-.001-.03a1.09 1.09 0 0 0-1.588-.944l-6.688 3.434zm0 4.791 3.772-1.753a2.48 2.48 0 0 0 1.433-2.304 1.09 1.09 0 0 0-1.594-.942l-3.611 1.88Z" />
        <path fill="#B6C8CE" d="M13.264 18.172v4.344c0 .421.232.808.604 1.006l4.475 2.385a.533.533 0 0 0 .784-.47v-4.096l.043-.023Z" />
      </g>
    </IconBase>
  );
}
/* eslint-enable no-restricted-syntax */

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
 * Pix: um losango vazado, a forma geral do símbolo — não a marca registrada
 * do Banco Central, que tem traçado próprio e não deve ser redesenhada.
 */
export function IconPix(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 1.6 14.4 8 8 14.4 1.6 8Zm0 3.4L5 8l3 3 3-3Z"
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
