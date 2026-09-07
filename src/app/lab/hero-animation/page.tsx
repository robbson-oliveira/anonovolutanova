"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@ds/index";
import { BookStage, STAGE_SIZE, type CoverSrc } from "@sections/BookStage";
const capaColor = "/img/capa-color.png";
const capaClassica = "/img/capa-classica.png";
const capaSolo = "/img/capa-solo.png";
const referencia = "/img/referencia-posicionamento.png";

/**
 * Builder da animação das duas agendas do Hero.
 *
 * O palco renderizado é o BookStage real — não uma cópia — então tudo que se
 * vê aqui é exatamente o que a home produz. Os keyframes ficam em
 * ds/styles/base.css e os tempos/easings em ds/styles/tokens.css; esta página
 * é só o instrumento para enxergá-los.
 *
 * Nada aqui recalcula transform à mão: os fantasmas congelam o próprio
 * componente via Web Animations API (pause + currentTime), o que garante
 * fidelidade mesmo com a rotação em torno de âncora deslocada.
 */

const DEFAULT_ASSETS = {
  referencia: referencia as CoverSrc,
  color: capaColor as CoverSrc,
  classica: capaClassica as CoverSrc,
  miniatura: capaSolo as CoverSrc,
};

type AssetKey = keyof typeof DEFAULT_ASSETS;

const ASSET_LABELS: Record<AssetKey, { title: string; hint: string }> = {
  referencia: {
    title: "Referência",
    hint: "Composição alvo — onde as agendas devem terminar",
  },
  color: { title: "Agenda Color", hint: "Capa aquarela, entra por cima" },
  classica: { title: "Agenda Clássica", hint: "Capa marinho, assenta atrás" },
  miniatura: { title: "Miniatura do card", hint: "Thumb do card de preço" },
};

const VIEWPORTS = [
  { key: "mobile", label: "Mobile", width: 390 },
  { key: "tablet", label: "Tablet", width: 768 },
  { key: "desktop", label: "Desktop", width: 1280 },
] as const;

type ViewportKey = (typeof VIEWPORTS)[number]["key"];

const KEYFRAME_SOURCES = [
  { name: "ds-book-back-in", timing: "0.9s", target: "Clássica" },
  { name: "ds-book-fan-out", timing: "var(--duration-book) · 2500ms", target: "Color" },
  { name: "ds-pop-in", timing: "0.6s · delay 2.1s", target: "Card de preço" },
];

const FALLBACK_DURATION = 2700;

const srcOf = (src: CoverSrc) => src;

/**
 * Tamanho natural de public/img/referencia-posicionamento.png. A referência
 * NÃO é quadrada e é um recorte fechado nas duas agendas — ela não tem a
 * folga do palco nem o cartão de preço. Por isso ela é desenhada no tamanho
 * real dela e ancorada no canto do palco: escala 1,00 = 1px da referência
 * vale 1px do palco de 740. Espremer com object-contain dentro do quadrado
 * (como era antes) inventava uma escala que não correspondia a nada.
 */
const REF_NATURAL = { width: 1017, height: 989 };

/**
 * Calibragem medida no navegador com a animação congelada no último frame:
 * compara a caixa das capas da referência com a caixa das capas do BookStage
 * real. Com estes números a referência abre já encaixada.
 */
const REF_CALIBRATION = { scale: 0.817, x: -47, y: -73 };

/**
 * Versão do ajuste salvo. Subir a versão sempre que REF_CALIBRATION mudar:
 * assim um ajuste antigo guardado no navegador não sobrescreve a calibragem
 * nova logo depois da tela abrir (era isso que fazia a referência "encolher"
 * um instante depois de carregar).
 */
const REF_STORAGE_KEY = "lab.hero-animation.ref-align.v2";

type RefAlign = { scale: number; x: number; y: number };

function loadRefAlign(): RefAlign {
  if (typeof window === "undefined") return REF_CALIBRATION;
  try {
    const raw = window.localStorage.getItem(REF_STORAGE_KEY);
    if (!raw) return REF_CALIBRATION;
    const parsed = JSON.parse(raw) as Partial<RefAlign>;
    const ok = (n: unknown): n is number =>
      typeof n === "number" && Number.isFinite(n);
    if (ok(parsed.scale) && ok(parsed.x) && ok(parsed.y)) {
      return { scale: parsed.scale, x: parsed.x, y: parsed.y };
    }
  } catch {
    /* storage indisponível ou corrompido: cai na calibragem */
  }
  return REF_CALIBRATION;
}

export default function HeroAnimationLab() {
  const [runId, setRunId] = useState(0);
  const [assets, setAssets] = useState(DEFAULT_ASSETS);

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);

  const [showRef, setShowRef] = useState(true);
  const [refOpacity, setRefOpacity] = useState(0.4);
  const [refBlend, setRefBlend] = useState<"normal" | "difference">("normal");
  const [refScale, setRefScale] = useState(REF_CALIBRATION.scale);
  const [refX, setRefX] = useState(REF_CALIBRATION.x);
  const [refY, setRefY] = useState(REF_CALIBRATION.y);

  // Estado salvo só é lido depois da hidratação, para não divergir do SSR.
  useEffect(() => {
    const saved = loadRefAlign();
    setRefScale(saved.scale);
    setRefX(saved.x);
    setRefY(saved.y);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        REF_STORAGE_KEY,
        JSON.stringify({ scale: refScale, x: refX, y: refY }),
      );
    } catch {
      /* sem storage: o ajuste só não sobrevive ao reload */
    }
  }, [refScale, refX, refY]);

  const [showInitial, setShowInitial] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showGuides, setShowGuides] = useState(false);

  const [viewport, setViewport] = useState<ViewportKey>("desktop");
  const [panelOpen, setPanelOpen] = useState(false);

  const liveRef = useRef<HTMLDivElement>(null);

  const liveAnimations = useCallback((): Animation[] => {
    const el = liveRef.current;
    if (!el?.getAnimations) return [];
    return el.getAnimations({ subtree: true });
  }, []);

  // Ao (re)montar o palco, mede a duração total real a partir dos próprios
  // keyframes em vez de repetir os números do CSS aqui.
  useEffect(() => {
    const anims = liveAnimations();
    if (!anims.length) return;
    const total = Math.max(
      ...anims.map((a) => Number(a.effect?.getComputedTiming().endTime ?? 0)),
    );
    setDuration(total || FALLBACK_DURATION);
    setTime(0);
    setPlaying(true);
  }, [runId, liveAnimations]);

  useEffect(() => {
    for (const a of liveAnimations()) a.playbackRate = speed;
  }, [speed, runId, liveAnimations]);

  useEffect(() => {
    for (const a of liveAnimations()) {
      if (playing) a.play();
      else a.pause();
    }
  }, [playing, runId, liveAnimations]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const anims = liveAnimations();
      if (anims.length) {
        const t = Math.max(...anims.map((a) => Number(a.currentTime ?? 0)));
        setTime(Math.min(t, duration));
        if (t >= duration) {
          setPlaying(false);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, liveAnimations]);

  function scrub(value: number) {
    setPlaying(false);
    setTime(value);
    for (const a of liveAnimations()) {
      a.pause();
      a.currentTime = value;
    }
  }

  function swapAsset(key: AssetKey, file: File) {
    const url = URL.createObjectURL(file);
    setAssets((prev) => {
      const old = prev[key];
      if (typeof old === "string" && old.startsWith("blob:")) {
        URL.revokeObjectURL(old);
      }
      return { ...prev, [key]: url };
    });
    setRunId((n) => n + 1);
  }

  function resetAsset(key: AssetKey) {
    setAssets((prev) => {
      const old = prev[key];
      if (typeof old === "string" && old.startsWith("blob:")) {
        URL.revokeObjectURL(old);
      }
      return { ...prev, [key]: DEFAULT_ASSETS[key] };
    });
    setRunId((n) => n + 1);
  }

  const frame = VIEWPORTS.find((v) => v.key === viewport) ?? VIEWPORTS[2];
  const scale = Math.min(1, frame.width / STAGE_SIZE);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {panelOpen && (
        <button
          type="button"
          aria-label="Fechar painel"
          onClick={() => setPanelOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[330px] max-w-[85vw] flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-200 lg:static lg:max-w-none lg:translate-x-0",
          panelOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h1 className="text-sm font-bold text-white">Animação das agendas</h1>
            <p className="text-[11px] text-slate-400">Builder · Hero 2027</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Fechar painel"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Panel title="Reprodução">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex-1 rounded bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 hover:bg-white"
              >
                {playing ? "Pausar" : "Reproduzir"}
              </button>
              <button
                type="button"
                onClick={() => setRunId((n) => n + 1)}
                className="flex-1 rounded border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                Repetir
              </button>
            </div>

            <Slider
              label="Linha do tempo"
              value={time}
              min={0}
              max={duration}
              step={10}
              onChange={scrub}
              readout={`${Math.round(time)} / ${Math.round(duration)}ms`}
            />

            <Slider
              label="Velocidade"
              value={speed}
              min={0.05}
              max={2}
              step={0.05}
              onChange={setSpeed}
              readout={`${speed.toFixed(2)}x`}
            />
          </Panel>

          <Panel title="Referência">
            <Toggle
              label="Mostrar composição alvo"
              checked={showRef}
              onChange={setShowRef}
              dot="bg-amber-400"
            />
            <Slider
              label="Opacidade"
              value={refOpacity}
              min={0}
              max={1}
              step={0.05}
              onChange={setRefOpacity}
              readout={`${Math.round(refOpacity * 100)}%`}
              disabled={!showRef}
            />
            <div className="flex gap-1">
              {(["normal", "difference"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  disabled={!showRef}
                  onClick={() => setRefBlend(mode)}
                  className={cn(
                    "flex-1 rounded px-2 py-1.5 text-[11px] font-medium disabled:opacity-40",
                    refBlend === mode
                      ? "bg-slate-100 text-slate-900"
                      : "border border-slate-700 text-slate-300 hover:bg-slate-800",
                  )}
                >
                  {mode === "normal" ? "Normal" : "Diferença"}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-snug text-slate-500">
              No modo diferença, alinhamento perfeito fica preto — é o jeito
              mais preciso de encaixar o palco na referência.
            </p>
            <Slider
              label="Escala"
              value={refScale}
              min={0.3}
              max={1.8}
              step={0.001}
              onChange={setRefScale}
              readout={refScale.toFixed(3)}
              disabled={!showRef}
            />
            <Slider
              label="Deslocar X"
              value={refX}
              min={-300}
              max={300}
              step={1}
              onChange={setRefX}
              readout={`${refX}px`}
              disabled={!showRef}
            />
            <Slider
              label="Deslocar Y"
              value={refY}
              min={-300}
              max={300}
              step={1}
              onChange={setRefY}
              readout={`${refY}px`}
              disabled={!showRef}
            />
            <div className="rounded border border-slate-800 bg-slate-950 px-2.5 py-2 text-[11px] leading-snug text-slate-400">
              <p>
                Referência natural:{" "}
                <span className="font-mono text-slate-200">
                  {REF_NATURAL.width}×{REF_NATURAL.height}
                </span>{" "}
                · palco{" "}
                <span className="font-mono text-slate-200">
                  {STAGE_SIZE}×{STAGE_SIZE}
                </span>
              </p>
              <p>
                Na tela:{" "}
                <span className="font-mono text-slate-200">
                  {Math.round(REF_NATURAL.width * refScale)}×
                  {Math.round(REF_NATURAL.height * refScale)}
                </span>{" "}
                em{" "}
                <span className="font-mono text-slate-200">
                  {refX},{refY}
                </span>
              </p>
              <p className="mt-1 text-slate-500">
                Escala 1,000 = 1px da referência para 1px do palco. Seu ajuste
                fica salvo neste navegador.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRefScale(REF_CALIBRATION.scale);
                setRefX(REF_CALIBRATION.x);
                setRefY(REF_CALIBRATION.y);
              }}
              className="w-full rounded border border-slate-700 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-800"
            >
              Voltar à calibragem
            </button>
          </Panel>

          <Panel title="Comparação">
            <Toggle
              label="Fantasma: início"
              checked={showInitial}
              onChange={setShowInitial}
              dot="bg-blue-400"
            />
            <Toggle
              label="Fantasma: final"
              checked={showFinal}
              onChange={setShowFinal}
              dot="bg-emerald-400"
            />
            <Toggle
              label="Guias de centro"
              checked={showGuides}
              onChange={setShowGuides}
              dot="bg-fuchsia-400"
            />
          </Panel>

          <Panel title="Assets">
            {(Object.keys(DEFAULT_ASSETS) as AssetKey[]).map((key) => (
              <AssetSlot
                key={key}
                assetKey={key}
                src={assets[key]}
                isCustom={assets[key] !== DEFAULT_ASSETS[key]}
                onSwap={(file) => swapAsset(key, file)}
                onReset={() => resetAsset(key)}
              />
            ))}
          </Panel>

          <Panel title="Viewport">
            <div className="flex gap-1">
              {VIEWPORTS.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setViewport(v.key)}
                  className={cn(
                    "flex-1 rounded px-2 py-1.5 text-[11px] font-medium",
                    viewport === v.key
                      ? "bg-slate-100 text-slate-900"
                      : "border border-slate-700 text-slate-300 hover:bg-slate-800",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-amber-200">
              Hoje o palco é <code className="font-mono">hidden</code> abaixo de
              1024px no Hero — em produção a animação não existe no mobile.
              Aqui ele aparece sempre, escalado, para poder ser desenhado.
            </p>
          </Panel>

          <Panel title="Peça compartilhada">
            <p className="text-[11px] leading-snug text-slate-400">
              O palco aqui é o próprio{" "}
              <code className="font-mono text-slate-200">BookStage</code> — a
              mesma peça usada no Hero do site e exibida no catálogo do design
              system (<code className="font-mono">/design-system/lacunas</code>
              ). Este laboratório é o pai: quem ajusta, ajusta aqui. Nunca
              duplicar a animação em outro arquivo.
            </p>
          </Panel>

          <Panel title="Onde editar">
            {KEYFRAME_SOURCES.map((k) => (
              <div key={k.name} className="text-[11px] leading-snug">
                <p className="font-mono text-slate-200">{k.name}</p>
                <p className="text-slate-500">
                  {k.target} · {k.timing}
                </p>
              </div>
            ))}
            <p className="text-[11px] leading-snug text-slate-500">
              Keyframes em{" "}
              <code className="font-mono">ds/styles/base.css</code>; durações e
              easings em <code className="font-mono">ds/styles/tokens.css</code>
              .
            </p>
          </Panel>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-900"
          >
            Controles
          </button>
          <span className="text-xs text-slate-400">
            {frame.label} · {Math.round(time)}ms
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-surface p-6">
          <div style={{ width: frame.width }} className="max-w-full">
            <div className="mb-2 flex items-center justify-between text-[11px] text-text-muted">
              <span>
                {frame.label} · {frame.width}px
              </span>
              <span>
                palco {STAGE_SIZE}px · {Math.round(scale * 100)}%
              </span>
            </div>

            <div
              className="relative border border-dashed border-text-muted/30"
              style={{ height: STAGE_SIZE * scale }}
            >
              <div
                key={runId}
                className="absolute left-1/2 top-0"
                style={{
                  width: STAGE_SIZE,
                  height: STAGE_SIZE,
                  marginLeft: -STAGE_SIZE / 2,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                {showGuides && <Guides />}

                <div ref={liveRef} className="absolute inset-0 z-10">
                  <BookStage
                    colorSrc={assets.color}
                    classicaSrc={assets.classica}
                    thumbSrc={assets.miniatura}
                  />
                </div>

                {showInitial && (
                  <GhostStage
                    atStart
                    label="Início"
                    colorClass="bg-blue-600"
                    assets={assets}
                  />
                )}
                {showFinal && (
                  <GhostStage
                    atStart={false}
                    label="Final"
                    colorClass="bg-emerald-600"
                    assets={assets}
                  />
                )}

                {showRef && (
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-30"
                    style={{
                      opacity: refOpacity,
                      mixBlendMode: refBlend,
                    }}
                  >
                    {/* Tamanho natural + origem no canto do palco: a escala do
                        painel vira uma medida real, não um encaixe implícito. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srcOf(assets.referencia)}
                      alt=""
                      style={{
                        width: REF_NATURAL.width,
                        height: REF_NATURAL.height,
                        maxWidth: "none",
                        transform: `translate(${refX}px, ${refY}px) scale(${refScale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Guides() {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <div className="absolute left-1/2 top-0 h-full w-px bg-fuchsia-500/40" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-fuchsia-500/40" />
      <div className="absolute inset-0 border border-fuchsia-500/30" />
    </div>
  );
}

/**
 * Cópia do palco congelada no primeiro ou no último frame, via Web Animations
 * API. Não recria valores de keyframe — pausa a animação real numa posição.
 */
function GhostStage({
  atStart,
  label,
  colorClass,
  assets,
}: {
  atStart: boolean;
  label: string;
  colorClass: string;
  assets: typeof DEFAULT_ASSETS;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el?.getAnimations) return;
    for (const animation of el.getAnimations({ subtree: true })) {
      animation.pause();
      const timing = animation.effect?.getComputedTiming();
      animation.currentTime = atStart ? 0 : (timing?.endTime ?? 0);
    }
  }, [atStart, assets]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-20 opacity-40 grayscale"
    >
      <span
        className={cn(
          "absolute left-2 top-2 z-30 rounded px-1.5 py-0.5 text-[10px] font-bold text-white",
          colorClass,
        )}
      >
        {label}
      </span>
      <BookStage
        colorSrc={assets.color}
        classicaSrc={assets.classica}
        thumbSrc={assets.miniatura}
      />
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-800 px-4 py-4">
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  readout,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  readout: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("block", disabled && "opacity-40")}>
      <span className="mb-1 flex items-baseline justify-between text-[11px]">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono tabular-nums text-slate-500">{readout}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-slate-100"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  dot,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dot: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-slate-100"
      />
      <span className={cn("inline-block h-2 w-2 rounded-full", dot)} />
      {label}
    </label>
  );
}

function AssetSlot({
  assetKey,
  src,
  isCustom,
  onSwap,
  onReset,
}: {
  assetKey: AssetKey;
  src: CoverSrc;
  isCustom: boolean;
  onSwap: (file: File) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = ASSET_LABELS[assetKey];

  return (
    <div className="flex items-center gap-3 rounded border border-slate-800 bg-slate-950 p-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={srcOf(src)} alt="" className="max-h-full max-w-full object-contain" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-slate-200">
          {meta.title}
          {isCustom && <span className="ml-1 text-amber-400">•</span>}
        </p>
        <p className="truncate text-[10px] text-slate-500">{meta.hint}</p>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[10px] font-bold text-slate-300 underline underline-offset-2 hover:text-white"
          >
            Trocar
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-slate-500 underline underline-offset-2 hover:text-slate-300"
            >
              Restaurar
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSwap(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
