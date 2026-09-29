#!/usr/bin/env bash
# Configura o WordPress local (dev/wordpress). Pode rodar de novo: cada passo
# confere antes de criar. Roda dentro do container wpcli:
#
#   docker compose -f dev/wordpress/docker-compose.yml run --rm wpcli bash /setup/setup.sh
set -euo pipefail

URL="http://localhost:8088"

echo "» Aguardando o banco…"
for _ in $(seq 1 30); do
  wp db check >/dev/null 2>&1 && break
  sleep 2
done

if ! wp core is-installed 2>/dev/null; then
  # Senha aleatória. É um WordPress local, mas não há motivo para uma senha
  # previsível.
  ADMIN_PASS="$(php -r 'echo bin2hex(random_bytes(12));')"
  wp core install \
    --url="$URL" \
    --title="Ano Novo, Luta Nova (local)" \
    --admin_user=admin \
    --admin_password="$ADMIN_PASS" \
    --admin_email=dev@anonovolutanova.local \
    --skip-email
  # A senha vai para um arquivo fora do git (dev/wordpress/.admin-password),
  # não para o terminal.
  printf 'usuário: admin\nsenha: %s\n' "$ADMIN_PASS" > /setup/.admin-password
  chmod 600 /setup/.admin-password || true
  echo "» wp-admin: $URL/wp-admin — usuário e senha em dev/wordpress/.admin-password"
fi

echo "» Idioma, fuso e links permanentes"
wp language core install pt_BR --activate >/dev/null 2>&1 || true
wp option update timezone_string America/Sao_Paulo >/dev/null
wp rewrite structure '/%postname%/' >/dev/null
# O WP-CLI não escreve o .htaccess fora do Apache; sem ele, /wp-json não abre.
cat > /var/www/html/.htaccess <<'HTACCESS'
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
HTACCESS

echo "» Plugins"
wp plugin is-installed woocommerce || wp plugin install woocommerce
wp plugin is-installed woo-asaas || wp plugin install woo-asaas
wp plugin is-installed woocommerce-mercadopago || wp plugin install woocommerce-mercadopago
wp plugin activate woocommerce woo-asaas woocommerce-mercadopago anln-storefront-bridge
wp plugin delete hello akismet >/dev/null 2>&1 || true
wp language plugin install woocommerce woo-asaas woocommerce-mercadopago pt_BR >/dev/null 2>&1 || true

echo "» Loja (WooCommerce, produto 2027, frete, cupom, bridge)"
wp eval-file /setup/setup.php

echo "✓ Pronto. Store API: $URL/wp-json/wc/store/v1/products"
