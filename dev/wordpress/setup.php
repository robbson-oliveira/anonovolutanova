<?php
/**
 * Configuração da loja local. Roda com `wp eval-file` (setup.sh). Idempotente:
 * procura antes de criar, e ajusta o que já existe.
 *
 * Espelha o que a produção vai ter (PLANO-MIGRACAO-NEXTJS.md, Fase 3):
 *  - produto variável "Agenda Ano Novo, Luta Nova 2027", atributo Edição
 *    (Color | Clássica), R$ 109,90, estoque por variação;
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

// ----- Produto 2027 -----
$sku       = 'ANLN-2027';
$parent_id = wc_get_product_id_by_sku( $sku );
$parent    = $parent_id ? wc_get_product( $parent_id ) : new WC_Product_Variable();

$attribute = new WC_Product_Attribute();
$attribute->set_name( 'Edição' );
$attribute->set_options( [ 'Color', 'Clássica' ] );
$attribute->set_visible( true );
$attribute->set_variation( true );

$parent->set_name( 'Agenda Ano Novo, Luta Nova 2027' );
$parent->set_slug( 'agenda-ano-novo-luta-nova-2027' );
$parent->set_sku( $sku );
$parent->set_status( 'publish' );
$parent->set_catalog_visibility( 'visible' );
$parent->set_short_description( 'Agenda católica 2027 inspirada em São Josemaria Escrivá.' );
$parent->set_attributes( [ $attribute ] );
$parent_id = $parent->save();

$editions = [
	'Color'    => 'ANLN-2027-COLOR',
	'Clássica' => 'ANLN-2027-CLASSICA',
];
foreach ( $editions as $value => $variation_sku ) {
	$variation_id = wc_get_product_id_by_sku( $variation_sku );
	$variation    = $variation_id ? wc_get_product( $variation_id ) : new WC_Product_Variation();
	$variation->set_parent_id( $parent_id );
	// Atributo personalizado: a chave é o nome sanitizado ("edicao").
	$variation->set_attributes( [ sanitize_title( 'Edição' ) => $value ] );
	$variation->set_sku( $variation_sku );
	$variation->set_regular_price( '109.90' );
	$variation->set_manage_stock( true );
	if ( ! $variation_id ) {
		$variation->set_stock_quantity( 50 );
	}
	$variation->set_weight( '0.5' );
	$variation->set_length( '22' );
	$variation->set_width( '16' );
	$variation->set_height( '3' );
	$variation->set_status( 'publish' );
	$variation->save();
}
WC_Product_Variable::sync( $parent_id );
$log( "Produto 2027: id {$parent_id} (use ANLN_PRODUCT_ID={$parent_id})" );

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
$code = 'mariana10';
if ( ! wc_get_coupon_id_by_code( $code ) ) {
	$coupon = new WC_Coupon();
	$coupon->set_code( $code );
	$coupon->set_description( 'Afiliada: Mariana (teste local)' );
	$coupon->set_discount_type( 'percent' );
	$coupon->set_amount( 10 );
	$coupon->set_individual_use( true );
	$coupon->set_product_ids( [ $parent_id ] );
	$coupon->save();
}
$log( 'Cupom: MARIANA10 (10%)' );

// ----- anln-storefront-bridge -----
update_option( 'anln_bridge_allowed_origins', "http://localhost:3000" );
update_option( 'anln_bridge_free_shipping_min_qty', '4' );
update_option( 'anln_bridge_free_shipping_hide_paid', '1' );
update_option( 'anln_bridge_max_installments', '3' );
update_option( 'anln_bridge_interest_free_installments', '3' );
$log( 'Bridge: CORS localhost, frete grátis a partir de 4, 3x sem juros' );
