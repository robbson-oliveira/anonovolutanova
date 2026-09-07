#!/usr/bin/env python3
"""Mede um bloco do wireframe e todas as camadas dentro dele.

Uso:
  python3 /tmp/medir.py "Todo dia" [saida.json]

Abre o wireframe em viewport 1440, acha o elemento cujo texto contém o termo,
sobe até o card (elemento com border-radius) e imprime, para o card e para
CADA descendente visível: caixa em px relativa ao card, transform/rotate,
opacity, box-shadow, border-radius, cor de fundo, fonte, e src de imagens.
Também salva um screenshot do card em /tmp/browser/wireframe-bloco.png.
"""
import asyncio, json, sys, pathlib
from playwright.async_api import async_playwright

TERMO = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "/tmp/browser/medidas.json"
URL = "http://localhost:8080/wireframe/wireframe-v2.html"

JS = """
(termo) => {
  const alvo = [...document.querySelectorAll('*')].find(
    (e) => e.textContent && e.textContent.includes(termo) && e.children.length < 8
  );
  if (!alvo) return null;
  let card = alvo;
  while (card.parentElement) {
    const s = getComputedStyle(card);
    if (parseFloat(s.borderRadius) > 0 && card.getBoundingClientRect().width > 300) break;
    card = card.parentElement;
  }
  const cb = card.getBoundingClientRect();
  const ler = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      src: el.getAttribute('src') || undefined,
      texto: (el.children.length === 0 && el.textContent.trim().slice(0, 40)) || undefined,
      box: { x: Math.round((r.left - cb.left) * 100) / 100,
             y: Math.round((r.top - cb.top) * 100) / 100,
             w: Math.round(r.width * 100) / 100,
             h: Math.round(r.height * 100) / 100 },
      transform: s.transform !== 'none' ? s.transform : undefined,
      opacity: s.opacity !== '1' ? s.opacity : undefined,
      boxShadow: s.boxShadow !== 'none' ? s.boxShadow : undefined,
      radius: s.borderRadius !== '0px' ? s.borderRadius : undefined,
      bg: s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : undefined,
      fonte: el.children.length === 0
        ? `${s.fontFamily.split(',')[0]} ${s.fontSize}/${s.lineHeight} ${s.fontWeight} ${s.letterSpacing} ${s.color}`
        : undefined,
      padding: s.padding !== '0px' ? s.padding : undefined,
      gap: s.gap && s.gap !== 'normal' ? s.gap : undefined,
    };
  };
  const camadas = [...card.querySelectorAll('*')]
    .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4; })
    .map(ler);
  return { card: ler(card), camadas };
}
"""

async def main():
    pathlib.Path("/tmp/browser").mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await (await b.new_context(viewport={"width": 1440, "height": 1800})).new_page()
        await page.goto(URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)
        for _ in range(12):  # dispara animações de scroll
            await page.mouse.wheel(0, 900)
            await page.wait_for_timeout(250)
        dados = await page.evaluate(JS, TERMO)
        if not dados:
            print("bloco nao encontrado para:", TERMO); await b.close(); return
        pathlib.Path(OUT).write_text(json.dumps(dados, indent=2, ensure_ascii=False))
        print(json.dumps(dados["card"], indent=2, ensure_ascii=False))
        print(f"{len(dados['camadas'])} camadas -> {OUT}")
        await b.close()

asyncio.run(main())
