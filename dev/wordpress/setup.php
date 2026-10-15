<?php
/**
 * Configuração da loja local. Roda com `wp eval-file` (setup.sh). Idempotente:
 * procura antes de criar, e ajusta o que já existe.
 *
 * Espelha o que a produção vai ter (PLANO-MIGRACAO-NEXTJS.md, Fase 3):
 *  - um produto simples por edição ("Agenda Ano Novo, Luta Nova 2027 —
 *    Edição Color" e "— Edição Clássica"), atributo Edição, R$ 109,90,
 *    estoque próprio e a capa como imagem principal;
 *  - zona Brasil com um frete pago de teste (no lugar da Frenet, que exige
 *    conta) e o "Frete grátis" sem requisito, que o bridge libera a partir de
 *    4 unidades;
 *  - cupom de afiliada MARIANA10 (10%);
 *  - opções do anln-storefront-bridge.
 */

defined( 'ABSPATH' ) || exit;

$log = static function ( string $msg ): void {
	WP_CLI::log( '  ' . $msg );
};

// ----- WooCommerce: Brasil, reais, checkout de visitante -----
$options = [
	'woocommerce_default_country'          => 'BR:ES',
	'woocommerce_currency'                 => 'BRL',
	'woocommerce_currency_pos'             => 'left_space',
	'woocommerce_price_thousand_sep'       => '.',
	'woocommerce_price_decimal_sep'        => ',',
	'woocommerce_price_num_decimals'       => '2',
	'woocommerce_calc_taxes'               => 'no',
	'woocommerce_enable_coupons'           => 'yes',
	'woocommerce_enable_guest_checkout'    => 'yes',
	'woocommerce_weight_unit'              => 'kg',
	'woocommerce_dimension_unit'           => 'cm',
	'woocommerce_coming_soon'              => 'no',
	'woocommerce_task_list_hidden'         => 'yes',
	'woocommerce_onboarding_profile'       => [ 'skipped' => true ],
	'woocommerce_allow_tracking'           => 'no',
];
foreach ( $options as $key => $value ) {
	update_option( $key, $value );
}
$log( 'WooCommerce: Brasil, BRL, visitante' );

// ----- Produtos 2027: um produto simples por edição -----
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

// The 2027 agenda used to be one variable product. Its variations hold the
// SKUs the simple products take now: free them and send it to the trash.
$legacy_id = wc_get_product_id_by_sku( 'ANLN-2027' );
$legacy    = $legacy_id ? wc_get_product( $legacy_id ) : null;
if ( $legacy && $legacy->is_type( 'variable' ) ) {
	foreach ( $legacy->get_children() as $child_id ) {
		$child = wc_get_product( $child_id );
		if ( $child ) {
			$child->set_sku( '' );
			$child->save();
		}
	}
	$legacy->set_sku( '' );
	$legacy->save();
	$legacy->delete( false );
	$log( "Produto variável antigo (id {$legacy_id}) na lixeira" );
}

/**
 * Upload a cover from public/img (mounted at /site-img) as the product image.
 */
$attach_cover = static function ( string $file, string $title ): int {
	$source = '/site-img/' . $file;
	if ( ! is_readable( $source ) ) {
		return 0;
	}
	$tmp = wp_tempnam( $file );
	copy( $source, $tmp );
	$id = media_handle_sideload( [ 'name' => $file, 'tmp_name' => $tmp ], 0, $title );
	return is_wp_error( $id ) ? 0 : (int) $id;
};

$editions = [
	'Color'    => [ 'sku' => 'ANLN-2027-COLOR', 'slug' => 'color', 'cover' => 'capa-color.png', 'env' => 'ANLN_PRODUCT_COLOR' ],
	'Clássica' => [ 'sku' => 'ANLN-2027-CLASSICA', 'slug' => 'classica', 'cover' => 'capa-classica.png', 'env' => 'ANLN_PRODUCT_CLASSIC' ],
];
$product_ids = [];
$env_lines   = [];
foreach ( $editions as $value => $edition ) {
	$id      = wc_get_product_id_by_sku( $edition['sku'] );
	$product = $id ? wc_get_product( $id ) : new WC_Product_Simple();

	// Informational attribute (not for variations): how the site tells the
	// editions apart, together with the product name.
	$attribute = new WC_Product_Attribute();
	$attribute->set_name( 'Edição' );
	$attribute->set_options( [ $value ] );
	$attribute->set_visible( true );
	$attribute->set_variation( false );

	$name = "Agenda Ano Novo, Luta Nova 2027 — Edição {$value}";
	$product->set_name( $name );
	$product->set_slug( 'agenda-ano-novo-luta-nova-2027-' . $edition['slug'] );
	$product->set_sku( $edition['sku'] );
	$product->set_status( 'publish' );
	$product->set_catalog_visibility( 'visible' );
	$product->set_short_description( 'Agenda católica 2027 inspirada em São Josemaria Escrivá.' );
	$product->set_attributes( [ $attribute ] );
	$product->set_regular_price( '109.90' );
	$product->set_manage_stock( true );
	if ( ! $id ) {
		$product->set_stock_quantity( 50 );
	}
	$product->set_weight( '0.5' );
	$product->set_length( '22' );
	$product->set_width( '16' );
	$product->set_height( '3' );
	if ( ! $product->get_image_id() ) {
		$image_id = $attach_cover( $edition['cover'], $name );
		if ( $image_id ) {
			$product->set_image_id( $image_id );
		}
	}
	$id            = $product->save();
	$product_ids[] = $id;
	$env_lines[]   = $edition['env'] . '=' . $id;
}
$log( 'Produtos 2027: use ' . implode( ' e ', $env_lines ) );

// ----- Frete: zona Brasil -----
$zone = null;
foreach ( WC_Shipping_Zones::get_zones() as $data ) {
	if ( 'Brasil' === $data['zone_name'] ) {
		$zone = new WC_Shipping_Zone( $data['id'] );
	}
}
if ( ! $zone ) {
	$zone = new WC_Shipping_Zone();
	$zone->set_zone_name( 'Brasil' );
	$zone->add_location( 'BR', 'country' );
	$zone->save();
}
$methods = array_map( static fn( $m ) => $m->id, $zone->get_shipping_methods() );
if ( ! in_array( 'flat_rate', $methods, true ) ) {
	$instance = $zone->add_shipping_method( 'flat_rate' );
	update_option(
		"woocommerce_flat_rate_{$instance}_settings",
		[
			'title'      => 'PAC (teste local)',
			'tax_status' => 'none',
			'cost'       => '24.90',
		]
	);
}
if ( ! in_array( 'free_shipping', $methods, true ) ) {
	$instance = $zone->add_shipping_method( 'free_shipping' );
	// Sem requisito próprio: quem libera é o bridge (a partir de N unidades).
	update_option(
		"woocommerce_free_shipping_{$instance}_settings",
		[
			'title'    => 'Frete grátis',
			'requires' => '',
		]
	);
}
$log( 'Frete: zona Brasil com PAC (teste) e Frete grátis' );

// ----- Cupom de afiliada -----
$code   = 'mariana10';
$coupon = new WC_Coupon( wc_get_coupon_id_by_code( $code ) );
$coupon->set_code( $code );
$coupon->set_description( 'Afiliada: Mariana (teste local)' );
$coupon->set_discount_type( 'percent' );
$coupon->set_amount( 10 );
$coupon->set_individual_use( true );
$coupon->set_product_ids( $product_ids );
$coupon->save();
$log( 'Cupom: MARIANA10 (10%)' );

// ----- anln-storefront-bridge -----
update_option( 'anln_bridge_allowed_origins', "http://localhost:3000" );
update_option( 'anln_bridge_free_shipping_min_qty', '4' );
update_option( 'anln_bridge_free_shipping_hide_paid', '1' );
update_option( 'anln_bridge_max_installments', '3' );
update_option( 'anln_bridge_interest_free_installments', '3' );
$log( 'Bridge: CORS localhost, frete grátis a partir de 4, 3x sem juros' );

// ----- Asaas (wc-asaas-store-api) -----
// The card gateway charges its own installment interest, so the bridge reads
// the installments from it, not from its options above. Only set when missing:
// the API key and the rest of the gateway are configured in wp-admin.
$asaas_card = get_option( 'woocommerce_asaas-credit-card_settings', array() );
$asaas_card = is_array( $asaas_card ) ? $asaas_card : array();
if ( empty( $asaas_card['max_installments'] ) ) {
	$asaas_card['max_installments'] = '3';
	update_option( 'woocommerce_asaas-credit-card_settings', $asaas_card );
}
$log( 'Asaas: cartão em até ' . $asaas_card['max_installments'] . 'x (juros por parcela no wp-admin)' );
