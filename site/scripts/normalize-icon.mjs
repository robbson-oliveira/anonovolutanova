#!/usr/bin/env node
/**
 * Normaliza um SVG de origem para o formato dos ícones do DS
 * (src/ds/icons/CONTRIBUTING.md descreve o contrato completo).
 *
 * O QUE ESTE SCRIPT NUNCA FAZ: escrever em liturgical.tsx ou ui.tsx. Ele só
 * imprime (ou grava num arquivo novo, se pedido) o componente pronto para
 * colar — a revisão humana antes de colar é o ponto de segurança do
 * processo, de propósito.
 *
 * Uso:
 *   node scripts/normalize-icon.mjs origem.svg --name IconNovaData \
 *     --grid 60 --ink "#B36928" [--label "Nome legível"] [--out arquivo.tsx]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { optimize } from "svgo";

const FORBIDDEN_TARGETS = ["liturgical.tsx", "ui.tsx"];

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      args[a.slice(2)] = argv[i + 1];
      i++;
    } else {
      args._.push(a);
    }
  }
  return args;
}

function fail(msg) {
  console.error(`\nerro: ${msg}\n`);
  process.exit(1);
}

function normalizeHex(input) {
  // aceita #RGB, #RRGGBB, rgb(r, g, b) e devolve variantes para casar no SVG
  const variants = new Set([input.toLowerCase()]);
  const hex = input.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1].toLowerCase();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    variants.add(`#${h}`);
    variants.add(`rgb(${r}, ${g}, ${b})`);
    variants.add(`rgb(${r},${g},${b})`);
  }
  const rgb = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgb) {
    const [, r, g, b] = rgb;
    const hexStr = `#${[r, g, b].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
    variants.add(hexStr);
    variants.add(`rgb(${r}, ${g}, ${b})`);
  }
  return [...variants];
}

const KEBAB_TO_CAMEL = [
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "fill-rule",
  "clip-rule",
  "fill-opacity",
  "stroke-opacity",
];

function main() {
  const args = parseArgs(process.argv.slice(2));
  const srcPath = args._[0];
  if (!srcPath) fail("faltou o caminho do SVG de origem.");
  if (!args.name) fail("faltou --name (ex.: IconNovaData).");
  if (!/^Icon[A-Z]/.test(args.name)) {
    fail(`--name deve começar com "Icon" seguido de maiúscula (recebido: "${args.name}").`);
  }
  const grid = args.grid ? Number(args.grid) : 60;
  if (![60, 16].includes(grid)) fail(`--grid deve ser 60 (litúrgico) ou 16 (interface), recebido ${grid}.`);
  if (!args.ink) fail('faltou --ink (a cor do desenho que vira currentColor, ex.: --ink "#B36928").');

  if (args.out) {
    const outName = basename(args.out).toLowerCase();
    if (FORBIDDEN_TARGETS.includes(outName)) {
      fail(
        `--out não pode ser ${outName} — este script nunca escreve nos arquivos de ` +
          "ícones já aprovados. Grave num arquivo novo e cole manualmente.",
      );
    }
  }

  const abs = resolve(srcPath);
  if (!existsSync(abs)) fail(`arquivo não encontrado: ${abs}`);
  const raw = readFileSync(abs, "utf8");

  const srcViewBox = raw.match(/viewBox="([^"]+)"/)?.[1];
  if (srcViewBox) {
    const [, , w, h] = srcViewBox.split(/\s+/).map(Number);
    if (w !== grid || h !== grid) {
      console.error(
        `aviso: o SVG de origem declara viewBox "${srcViewBox}", mas --grid pede ` +
          `${grid}x${grid}. Confira se a arte foi desenhada nesse canvas antes de colar.\n`,
      );
    }
  }

  const before = Buffer.byteLength(raw, "utf8");
  const result = optimize(raw, {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { removeViewBox: false } },
      },
    ],
  });
  if (result.error) fail(`SVGO falhou: ${result.error}`);
  const after = Buffer.byteLength(result.data, "utf8");

  let inner = result.data
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

  const inkVariants = normalizeHex(args.ink);
  let replaced = 0;
  for (const v of inkVariants) {
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reFill = new RegExp(`fill="${escaped}"`, "gi");
    const reStroke = new RegExp(`stroke="${escaped}"`, "gi");
    inner = inner.replace(reFill, () => {
      replaced++;
      return 'fill="currentColor"';
    });
    inner = inner.replace(reStroke, () => {
      replaced++;
      return 'stroke="currentColor"';
    });
  }

  for (const attr of KEBAB_TO_CAMEL) {
    const camel = attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    inner = inner.replaceAll(`${attr}=`, `${camel}=`);
  }

  const remainingColor = inner.match(/(?:fill|stroke)="(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))"/g);
  const label = args.label || "TODO: nome legível do ícone";
  const viewBoxProp =
    grid === 16
      ? ` viewBox="0 0 16 16" /* se for para ui.tsx, troque por viewBox={UI_BOX} */`
      : "";

  const snippet = `/** ${label} */
export function ${args.name}(props: IconProps) {
  return (
    <IconBase${viewBoxProp} fill="none" {...props}>
      ${inner}
    </IconBase>
  );
}`;

  console.log(`\n--- ${basename(abs)} -> ${args.name} ---`);
  console.log(`SVGO: ${before}B -> ${after}B (-${Math.round((1 - after / before) * 100)}%)`);
  console.log(`cor "${args.ink}" -> currentColor: ${replaced} ocorrência(s) trocada(s)`);
  if (remainingColor?.length) {
    console.error(
      `\naviso: sobraram ${remainingColor.length} cor(es) não convertida(s) — revise antes de colar:\n  ` +
        remainingColor.join("\n  "),
    );
  }
  console.log("\n--- componente pronto para colar ---\n");
  console.log(snippet);

  if (args.out) {
    writeFileSync(resolve(args.out), snippet + "\n", "utf8");
    console.log(`\nGravado também em ${args.out} (revise e cole manualmente no arquivo da família).`);
  }
}

main();
