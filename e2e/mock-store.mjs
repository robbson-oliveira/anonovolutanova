/**
 * Local stand-in for WooCommerce and the recovery routes.
 * Nothing here dials the real store. Tests point the site at this port.
 */
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT || 3999);
const captures = [];
const hanging = new Set();
let captureMode = "ok";

function line(id, key, quantity) {
  return {
    key,
    id,
    quantity,
    name: "Agenda",
    images: [],
    variation: [],
    quantity_limits: { minimum: 1, maximum: 49, multiple_of: 1, editable: true },
    prices: { price: "10990", currency_minor_unit: 2 },
    totals: {
      line_subtotal: String(10990 * quantity),
      line_total: String(10990 * quantity),
      currency_minor_unit: 2,
    },
  };
}

const carts = new Map();

function seed(token) {
  if (!carts.has(token)) {
    const items = token.startsWith("restore")
      ? [line(101, "color", 1), line(102, "classic", 4)]
      : [line(101, "color", 1)];
    carts.set(token, { items, coupons: [] });
  }
  return carts.get(token);
}

function cartJson(state) {
  const total = state.items.reduce((sum, item) => sum + Number(item.totals.line_subtotal), 0);
  return {
    items: state.items,
    items_count: state.items.reduce((sum, item) => sum + item.quantity, 0),
    coupons: state.coupons,
    shipping_rates: [
      {
        package_id: 0,
        shipping_rates: [
          {
            rate_id: "flat",
            name: "Frete teste",
            description: "",
            method_id: "flat_rate",
            price: "0",
            selected: true,
          },
        ],
      },
    ],
    shipping_address: {},
    billing_address: {},
    needs_shipping: true,
    payment_methods: ["asaas-pix"],
    errors: [],
    totals: {
      total_items: String(total),
      total_shipping: "0",
      total_discount: "0",
      total_fees: "0",
      total_price: String(total),
      currency_code: "BRL",
      currency_minor_unit: 2,
    },
  };
}

function product(id) {
  return {
    id,
    name: id === 101 ? "Color" : "Classica",
    type: "simple",
    is_in_stock: true,
    is_purchasable: true,
    prices: { price: "10990", currency_minor_unit: 2 },
    images: [],
  };
}

function read(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString() || ""));
  });
}

function send(res, status, body, token) {
  const origin = res.reqOrigin || "http://127.0.0.1:3000";
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Cart-Token": token || "mock-cart",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "Cart-Token",
  });
  res.end(JSON.stringify(body));
}

const config = {
  gateways: [
    {
      id: "asaas-pix",
      kind: "pix",
      title: "Pix",
      description: "",
      supports_tokenization: false,
      publishable_key: "",
      installments: null,
      discount_rule: null,
    },
  ],
  cpf_required: true,
  birthdate_required: false,
  free_shipping_min_qty: 4,
  currency: "BRL",
};

const paidOrder = {
  order_id: 1001,
  status: "processing",
  payment_status: "paid",
  paid: true,
  total: 109.9,
  instructions: null,
  order: {
    number: "1001",
    created_at: "2026-11-05T12:00:00-03:00",
    customer: {
      first_name: "Teste",
      last_name: "Exemplo",
      company: "",
      email: "teste@example.com",
      phone: "11987654321",
    },
    shipping_address: {
      first_name: "Teste",
      last_name: "Exemplo",
      address_1: "Rua Exemplo",
      number: "100",
      neighborhood: "Centro",
      address_2: "",
      city: "Sao Paulo",
      state: "SP",
      postcode: "01310100",
    },
    shipping: { method: "Frete teste", total: 0 },
    payment_method: { id: "asaas-pix", title: "Pix" },
    items: [
      {
        id: 1,
        product_id: 101,
        variation_id: 0,
        name: "Agenda",
        quantity: 1,
        subtotal: 109.9,
        total: 109.9,
        attributes: [],
        image: "",
      },
    ],
    fees: [],
    totals: { subtotal: 109.9, discount: 0, shipping: 0, total: 109.9, currency: "BRL" },
  },
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1:3999");
  res.reqOrigin = req.headers.origin || "http://127.0.0.1:3000";
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": res.reqOrigin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Cart-Token",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
    res.end();
    return;
  }

  if (url.pathname === "/__reset") {
    captures.length = 0;
    captureMode = "ok";
    for (const hung of hanging) {
      try {
        hung.end("{}");
      } catch {
        // Already closed.
      }
    }
    hanging.clear();
    carts.clear();
    return send(res, 200, { ok: true });
  }
  if (url.pathname === "/__mode" && req.method === "POST") {
    const body = JSON.parse((await read(req)) || "{}");
    captureMode = body.capture || "ok";
    return send(res, 200, { capture: captureMode });
  }
  if (url.pathname === "/__captures") {
    return send(res, 200, captures);
  }

  const token = String(req.headers["cart-token"] || "mock-cart");

  if (url.pathname === "/wp-json/wc/store/v1/products/101") return send(res, 200, product(101), token);
  if (url.pathname === "/wp-json/wc/store/v1/products/102") return send(res, 200, product(102), token);
  if (url.pathname === "/wp-json/anln-storefront/v1/checkout/config") return send(res, 200, config, token);
  if (url.pathname.startsWith("/wp-json/anln-storefront/v1/checkout/payment-instructions")) {
    return send(res, 200, paidOrder, token);
  }

  if (url.pathname === "/wp-json/anln/v1/carrinho" && req.method === "POST") {
    const body = JSON.parse((await read(req)) || "{}");
    captures.push(body);
    if (captureMode === "500") return send(res, 500, { ok: false }, token);
    if (captureMode === "hang") {
      hanging.add(res);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      hanging.delete(res);
      if (!res.writableEnded) send(res, 200, { ok: true }, token);
      return;
    }
    return send(res, 200, { ok: true }, token);
  }

  if (url.pathname === "/wp-json/anln/v1/carrinho/recuperar") {
    const rc = url.searchParams.get("rc") || "";
    if (rc.startsWith("b")) return send(res, 404, { ok: false }, token);
    if (rc.startsWith("c")) return send(res, 429, { ok: false }, token);
    if (!/^[A-Za-z0-9]{32}$/.test(rc)) return send(res, 404, { ok: false }, token);
    return send(res, 200, {
      ok: true,
      items: [
        { id: 101, quantity: 3 },
        { id: 102, quantity: 2 },
        { id: 199, quantity: 1 },
      ],
    }, token);
  }

  if (url.pathname === "/wp-json/wc/store/v1/checkout" && req.method === "POST") {
    return send(res, 200, {
      order_id: 1001,
      status: "processing",
      order_key: "mock_key",
      payment_method: "asaas-pix",
      payment_result: { payment_status: "success", payment_details: [], redirect_url: "" },
    }, token);
  }

  if (url.pathname === "/wp-json/wc/store/v1/cart/add-item" && req.method === "POST") {
    const body = JSON.parse((await read(req)) || "{}");
    const state = seed(token);
    if (body.id === 199) {
      return send(res, 400, {
        code: "woocommerce_rest_product_not_purchasable",
        message: "indisponivel",
        data: { cart: cartJson(state) },
      }, token);
    }
    return send(res, 200, cartJson(state), token);
  }

  if (url.pathname === "/wp-json/wc/store/v1/cart/update-item" && req.method === "POST") {
    const body = JSON.parse((await read(req)) || "{}");
    const state = seed(token);
    const item = state.items.find((entry) => entry.key === body.key);
    if (item) {
      item.quantity = body.quantity;
      item.totals.line_subtotal = String(10990 * item.quantity);
      item.totals.line_total = item.totals.line_subtotal;
    }
    return send(res, 200, cartJson(state), token);
  }

  if (url.pathname.startsWith("/wp-json/wc/store/v1/")) {
    return send(res, 200, cartJson(seed(token)), token);
  }

  send(res, 404, { ok: false }, token);
});

server.listen(PORT, "127.0.0.1");
