<?php
/*
Plugin Name: Pages by User Role for WordPress
Plugin URI: https://plugins.righthere.com/pages-by-user-role/
Description: Allow or Restrict access to Pages, Posts, and Custom Post Types based on the visitors User Role. Create private network with public homepage and private homepage.
Version: 1.7.2.101119
Author: RightHere Team
Author URI: https://plugins.righthere.com
*/

define( 'PUR_VERSION', '1.7.2' );
define( 'PUR_PATH', plugin_dir_path( __FILE__ ) );
define( 'PUR_URL', plugin_dir_url( __FILE__ ) );
define( 'PUR_SLUG', plugin_basename( __FILE__ ) );
define( 'PUR_ADMIN_ROLE', 'administrator' );

require_once( PUR_PATH . 'includes/class-pur-plugin.php' );

if ( ! defined( 'SHORTINIT' ) || true !== SHORTINIT ) {
	register_activation_hook( __FILE__, 'pur_install' );

	function pur_install() {
		require_once( PUR_PATH . 'includes/install.php' );

		if ( function_exists( 'handle_pur_install' ) ) {
			handle_pur_install();
		}
		
		add_option('pur_do_activation_redirect', true);
	}

	register_deactivation_hook( __FILE__, 'pur_uninstall' );

	function pur_uninstall() {
		require_once( PUR_PATH . 'includes/install.php' );

		if ( function_exists( 'handle_pur_uninstall' ) ) {
			handle_pur_uninstall();
		}
	}
}

function admin_init_pur_activation_redirect() {
	if ( get_option('pur_do_activation_redirect', false) ) {
		delete_option('pur_do_activation_redirect');
		if(!isset($_GET['activate-multi'])){
			wp_redirect( "admin.php?page=pur#pur-dashboard" );
		}
	}
}

add_action( 'admin_init', 'admin_init_pur_activation_redirect' );