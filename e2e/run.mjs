/**
 * Builds the site against the local mock (never the live store), once with
 * the recovery flag off and once with it on, and runs the Playwright flows.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "e2e", "output");
const artifacts = "/opt/cursor/artifacts";

function run(command, args, env, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited ${code}`));
    });
  });
}

function start(command, args, env) {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    detached: true,
  });
  return child;
}

async function waitFor(url) {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(url);
      if (response.status === 200) return;
    } catch {
      // Server still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`timed out waiting for ${url}`);
}

async function stop(child) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
}

const shared = {
  NEXT_PUBLIC_WP_URL: "http://127.0.0.1:3999",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  NEXT_PUBLIC_CHECKOUT_ENABLED: "true",
  NEXT_PUBLIC_GTM_ID: "",
};

await mkdir(out, { recursive: true });
const mock = start("node", ["e2e/mock-store.mjs"], {});
try {
  await waitFor("http://127.0.0.1:3999/wp-json/wc/store/v1/products/101");
  for (const flag of ["off", "on"]) {
    const env = {
      ...shared,
      NEXT_PUBLIC_CART_RECOVERY_ENABLED: flag === "on" ? "true" : "",
    };
    await run("npm", ["run", "build"], env, `build ${flag}`);
    spawnSync("pkill", ["-f", "next-server"]);
    spawnSync("pkill", ["-f", "next start"]);
    const server = start("npm", ["run", "start", "--", "--port", "3000"], {
      ANLN_PRECHECKOUT: "true",
      ANLN_PRODUCT_COLOR: "101",
      ANLN_PRODUCT_CLASSIC: "102",
    });
    try {
      await waitFor("http://127.0.0.1:3000/checkout");
      await run(
        "npx",
        ["playwright", "test", "-c", "e2e/playwright.config.ts"],
        { E2E_FLAG: flag, E2E_BASE_URL: "http://127.0.0.1:3000", CHROME_PATH: "/usr/bin/google-chrome" },
        `playwright ${flag}`,
      );
    } finally {
      await stop(server);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
} finally {
  await stop(mock);
  spawnSync("pkill", ["-f", "next start"]);
  spawnSync("pkill", ["-f", "e2e/mock-store.mjs"]);
}

try {
  const names = await readdir(out);
  await mkdir(artifacts, { recursive: true });
  for (const name of names) {
    if (name.endsWith(".png")) await copyFile(path.join(out, name), path.join(artifacts, name));
  }
} catch {
  // Artifacts dir is only there for the agent report.
}
