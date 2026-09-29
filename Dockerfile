# syntax=docker/dockerfile:1.7

# Imagem do site em Next.js para o Easypanel (D1 em aberto: na Vercel este
# arquivo não é usado). Saída standalone do Next: só o servidor e o que ele usa.
# Mesmo formato do camila-maehler-storefront.

ARG NODE_VERSION=24-alpine

# ---------- deps ----------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---------- builder ----------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* entram no bundle do navegador na hora do build: precisam chegar
# como --build-arg (no Easypanel, "Build Args"), não só como variável de
# ambiente de execução. As ANLN_* (ANLN_PRODUCT_COLOR, ANLN_PRODUCT_CLASSIC,
# ANLN_HOME_COMMING_SOON, ANLN_PRECHECKOUT) são só do servidor e ficam no
# ambiente de execução.
ARG NEXT_PUBLIC_WP_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CHECKOUT_ENABLED
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER
ENV NEXT_PUBLIC_WP_URL=$NEXT_PUBLIC_WP_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CHECKOUT_ENABLED=$NEXT_PUBLIC_CHECKOUT_ENABLED \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER=$NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sem a URL do WordPress o site até sobe (o env.ts cai no domínio atual), mas
# depois da virada isso apontaria o carrinho para o lugar errado. Melhor falhar
# o build do que descobrir em produção.
RUN if [ -z "$NEXT_PUBLIC_WP_URL" ]; then \
      echo "ERROR: NEXT_PUBLIC_WP_URL vazio. Passe como --build-arg (Easypanel: Build Args); o Next embute NEXT_PUBLIC_* no build." >&2; \
      exit 1; \
    fi

RUN npm run build

# ---------- runner ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# O standalone não leva .next/static nem public/: vão à parte.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
