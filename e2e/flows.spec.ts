import path from "node:path";
import { expect, test, type Page, type Response } from "@playwright/test";

const FLAG = process.env.E2E_FLAG === "on" ? "on" : "off";
const TOKEN = "a".repeat(32);
const OUT = path.join(process.cwd(), "e2e", "output");
const MOCK = "http://127.0.0.1:3999";

type Capture = {
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
  website?: string;
  items?: Array<{ id?: number; product_id?: number; quantity?: number }>;
  total?: number;
};

async function resetMock() {
  await fetch(`${MOCK}/__reset`, { method: "POST" });
}

async function setCapture(mode: "ok" | "500" | "hang") {
  await fetch(`${MOCK}/__mode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ capture: mode }),
  });
}

async function captures(): Promise<Capture[]> {
  const response = await fetch(`${MOCK}/__captures`);
  return response.json() as Promise<Capture[]>;
}

async function blockProduction(page: Page) {
  const blocked: string[] = [];
  await page.route(/anonovolutanova\.com\.br|joinotify|googletagmanager|google-analytics|facebook\.com|facebook\.net/, (route) => {
    blocked.push(route.request().url());
    return route.abort();
  });
  await page.route(/viacep\.com\.br/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        logradouro: "Rua Exemplo",
        bairro: "Centro",
        localidade: "Sao Paulo",
        uf: "SP",
      }),
    }),
  );
  return blocked;
}

async function rememberCart(page: Page, token: string) {
  await page.addInitScript((value) => {
    localStorage.setItem("anln_cart_token", value);
    localStorage.setItem("anln_consent", "granted");
  }, token);
}

async function leak(page: Page, token: string) {
  const found = await page.evaluate((value) => {
    const stored: string[] = [];
    for (const store of [localStorage, sessionStorage]) {
      for (let i = 0; i < store.length; i += 1) {
        const key = store.key(i) || "";
        stored.push(`${key}=${store.getItem(key)}`);
      }
    }
    return {
      html: document.documentElement.outerHTML.includes(value),
      cookie: document.cookie.includes(value),
      href: location.href.includes(value) || location.search.includes("rc="),
      referrer: document.referrer.includes(value),
      stored: stored.join("\n").includes(value),
      dataLayer: JSON.stringify((window as Window & { dataLayer?: unknown[] }).dataLayer || []).includes(value),
    };
  }, token);
  expect(found).toEqual({
    html: false,
    cookie: false,
    href: false,
    referrer: false,
    stored: false,
    dataLayer: false,
  });
}

async function fillContact(page: Page) {
  await page.locator("#email").fill("teste@example.com");
  await page.locator("#first-name").fill("Teste");
  await page.locator("#last-name").fill("Exemplo");
  await page.locator("#phone").fill("11987654321");
  await page.locator("#cpf").fill("52998224725");
}

async function pay(page: Page) {
  await page.getByRole("button", { name: /Continuar para entrega/ }).click();
  await page.locator("#postcode").fill("01310100");
  await page.locator("#number").fill("100");
  await expect(page.locator("#address-1")).toHaveValue(/Rua Exemplo/);
  await page.getByRole("button", { name: /Continuar para pagamento/ }).click();
  const button = page.getByRole("button", { name: /Pagar/ });
  await expect(button).toBeEnabled();
  const started = Date.now();
  await button.click();
  await page.waitForURL(/\/checkout\/order-received/, { timeout: 8000 });
  const elapsed = Date.now() - started;
  await expect(page.getByText("Processando")).toHaveCount(0);
  await expect(page.getByText("já está reservada")).toBeVisible();
  return elapsed;
}

test.beforeEach(async () => {
  await resetMock();
});

test.describe("flag off", () => {
  test.skip(FLAG !== "off", "this server was built with the flag on");

  test("drops rc before the document and does not capture", async ({ page }, info) => {
    const blocked = await blockProduction(page);
    const documents: Array<{ url: string; status: number }> = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "document") {
        documents.push({ url: response.url(), status: response.status() });
      }
    });
    await page.goto(`/carrinho?rc=${TOKEN}&utm_source=whatsapp&utm_medium=recuperacao&utm_campaign=carrinho_msg1`, {
      referer: `${MOCK}/wp-json/anln/v1/r/${TOKEN}?m=1`,
      waitUntil: "networkidle",
    });
    expect(documents[0]?.status).toBe(307);
    expect(documents[0]?.url).toContain("rc=");
    expect(documents.at(-1)?.status).toBe(200);
    expect(documents.at(-1)?.url).not.toContain("rc=");
    expect(page.url()).toContain("utm_source=whatsapp");
    await leak(page, TOKEN);
    const origin = (await page.context().cookies()).find((cookie) => cookie.name === "anln_origem");
    expect(origin?.value.includes(TOKEN) ?? false).toBe(false);
    expect(blocked).toEqual([]);
    await page.screenshot({ path: path.join(OUT, `cart-flag-off-${info.project.name}.png`) });
  });

  test("checkout has no opt-in and payment does not post", async ({ page }, info) => {
    const blocked = await blockProduction(page);
    await rememberCart(page, `checkout-${info.project.name}`);
    await page.goto("/checkout", { waitUntil: "networkidle" });
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#cart-recovery-consent")).toHaveCount(0);
    await page.screenshot({ path: path.join(OUT, `checkout-flag-off-${info.project.name}.png`) });
    await fillContact(page);
    await page.waitForTimeout(1800);
    expect(await captures()).toEqual([]);
    const elapsed = await pay(page);
    expect(elapsed).toBeLessThan(5000);
    expect(await captures()).toEqual([]);
    expect(blocked).toEqual([]);
    const banner = page.getByText("já está reservada");
    await banner.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(OUT, `paid-flag-off-${info.project.name}.png`),
      clip: { x: 0, y: 0, width: info.project.name === "desktop" ? 1440 : 390, height: 280 },
    });
  });
});

test.describe("flag on", () => {
  test.skip(FLAG !== "on", "this server was built with the flag off");

  test("restores on another device without keeping the token", async ({ page }, info) => {
    const blocked = await blockProduction(page);
    await rememberCart(page, `restore-${info.project.name}`);
    const documents: Response[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "document") documents.push(response);
    });
    await page.goto(`/carrinho?rc=${TOKEN}&utm_source=whatsapp&utm_campaign=carrinho_msg2`, {
      referer: `${MOCK}/wp-json/anln/v1/r/${TOKEN}?m=2`,
      waitUntil: "domcontentloaded",
    });
    expect(documents[0]?.status()).toBe(307);
    const cookie = (await documents[0].allHeaders())["set-cookie"] || "";
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie).toContain("Path=/carrinho");
    expect(documents.at(-1)?.url().includes("rc=")).toBe(false);
    await expect(page.getByText("Seu carrinho foi atualizado com o que você tinha separado.")).toBeVisible();
    await expect(page.getByRole("group", { name: "Quantidade da Edição Color" })).toContainText("3");
    await expect(page.getByRole("group", { name: "Quantidade da Edição Clássica" })).toContainText("4");
    await leak(page, TOKEN);
    expect((await page.context().cookies()).some((cookie) => cookie.name === "anln_rc")).toBe(false);
    expect(blocked).toEqual([]);
    await page.screenshot({ path: path.join(OUT, `recover-flag-on-${info.project.name}.png`) });
  });

  test("invalid, missing and rate-limited tokens leave the cart usable", async ({ page }) => {
    await blockProduction(page);
    await rememberCart(page, "restore-invalid");
    await page.goto("/carrinho?rc=nope", { waitUntil: "networkidle" });
    await expect(page.getByText("Escolha a sua edição")).toBeVisible();
    await expect(page.getByRole("group", { name: "Quantidade da Edição Color" })).toContainText("1");
    expect(page.url()).not.toContain("rc=");

    await page.goto(`/carrinho?rc=${"b".repeat(32)}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("group", { name: "Quantidade da Edição Color" })).toContainText("1");
    await expect(page.getByText("Seu carrinho foi atualizado")).toHaveCount(0);

    await page.goto(`/carrinho?rc=${"c".repeat(32)}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("group", { name: "Quantidade da Edição Clássica" })).toContainText("4");
  });

  test("unchecked opt-in does not post", async ({ page }, info) => {
    const blocked = await blockProduction(page);
    await rememberCart(page, `checkout-off-${info.project.name}`);
    await page.goto("/checkout", { waitUntil: "networkidle" });
    const box = page.locator("#cart-recovery-consent");
    await expect(box).toBeVisible();
    await expect(box).not.toBeChecked();
    await box.locator("xpath=../..").screenshot({
      path: path.join(OUT, `optin-unchecked-${info.project.name}.png`),
    });
    await fillContact(page);
    await page.waitForTimeout(1800);
    expect(await captures()).toEqual([]);
    expect(blocked).toEqual([]);
  });

  test("posts only after opt-in, with product id, quantity and total", async ({ page }, info) => {
    await blockProduction(page);
    await setCapture("ok");
    await rememberCart(page, `checkout-ok-${info.project.name}`);
    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillContact(page);
    await page.locator("#cart-recovery-consent").check();
    await expect.poll(captures, { timeout: 5000 }).toHaveLength(1);
    const [body] = await captures();
    expect(body.consent).toBe(true);
    expect(body.website).toBe("");
    expect(body.phone).toBe("11987654321");
    expect(body.items).toEqual([{ id: 101, quantity: 1 }]);
    expect(body.items?.[0]?.product_id).toBeUndefined();
    expect(body.total).toBe(109.9);
    expect(JSON.stringify(body).includes(TOKEN)).toBe(false);
    const elapsed = await pay(page);
    expect(elapsed).toBeLessThan(5000);
    expect(await captures()).toHaveLength(1);
    await page.screenshot({ path: path.join(OUT, `paid-capture-ok-${info.project.name}.png`), clip: { x: 0, y: 0, width: info.project.use.viewport?.width ?? 390, height: 280 } });
  });

  test("payment still finishes when capture returns 500", async ({ page }, info) => {
    await blockProduction(page);
    await setCapture("500");
    await rememberCart(page, `checkout-500-${info.project.name}`);
    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillContact(page);
    await page.locator("#cart-recovery-consent").check();
    await expect.poll(captures, { timeout: 5000 }).toHaveLength(1);
    const elapsed = await pay(page);
    expect(elapsed).toBeLessThan(5000);
    await expect(page.getByText("Processando")).toHaveCount(0);
    await page.screenshot({ path: path.join(OUT, `paid-capture-500-${info.project.name}.png`), clip: { x: 0, y: 0, width: info.project.use.viewport?.width ?? 390, height: 280 } });
  });

  test("payment does not wait when capture hangs", async ({ page }, info) => {
    await blockProduction(page);
    await setCapture("hang");
    await rememberCart(page, `checkout-hang-${info.project.name}`);
    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillContact(page);
    await page.locator("#cart-recovery-consent").check();
    await expect.poll(captures, { timeout: 5000 }).toHaveLength(1);
    const elapsed = await pay(page);
    expect(elapsed).toBeLessThan(5000);
    await expect(page.getByText("Processando")).toHaveCount(0);
    expect((await captures()).length).toBe(1);
    await page.screenshot({ path: path.join(OUT, `paid-capture-hang-${info.project.name}.png`), clip: { x: 0, y: 0, width: info.project.use.viewport?.width ?? 390, height: 280 } });
  });
});
