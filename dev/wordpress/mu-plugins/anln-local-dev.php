<?php
/**
 * Plugin Name: ANLN — ajustes do ambiente local
 * Description: Só para o WordPress do Docker (dev/wordpress). Nunca vai para produção.
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

if ( 'local' !== wp_get_environment_type() ) {
	return;
}

/*
 * O Next em desenvolvimento pode subir em qualquer porta (autoPort do preview).
 * Em vez de cadastrar cada uma no painel do bridge, qualquer http://localhost:N
 * entra na lista de CORS — só aqui, no ambiente local.
 */
add_filter(
	'anln_bridge_allowed_origins',
	static function ( array $origins ): array {
		$origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? (string) wp_unslash( $_SERVER['HTTP_ORIGIN'] ) : '';
		if ( preg_match( '#^http://(localhost|127\.0\.0\.1):\d+$#', $origin ) ) {
			$origins[] = $origin;
		}
		return $origins;
	}
);

/*
 * Sem servidor de e-mail no container: finge que enviou, em vez de gerar erro
 * a cada pedido. Os e-mails aparecem no log (wp-content/debug.log).
 */
add_filter(
	'pre_wp_mail',
	static function ( $short_circuit, array $atts ) {
		error_log( 'anln-local: e-mail para ' . ( is_array( $atts['to'] ) ? implode( ',', $atts['to'] ) : $atts['to'] ) . ' — ' . $atts['subject'] );
		return true;
	},
	10,
	2
);
