<?php

class pur_forced_login_frontend {
	var $options=array();
	var $show_page_on_front = false;
	function __construct(){
		$this->options = get_option( 'pur_options' );	
		if( isset( $this->options['forced_login'] ) && '1' == $this->options['forced_login'] ) {
			$this->options['forced_login_whitelist'] =  isset( $this->options['forced_login_whitelist'] ) ? $this->options['forced_login_whitelist'] : '' ;
			
			add_action( 'template_redirect', array( $this, 'forced_login') );
			
			
		}
		
		if( !is_admin() ){
			add_action( 'pre_option_page_on_front', array( $this, 'pre_option_page_on_front' ), 10, 3 );
			
			if( isset( $this->options['frontpage_logged_in'] ) && $this->options['frontpage_logged_in'] > 0 ){
				$this->show_page_on_front = true;
			}
			
			if( isset( $this->options['frontpage_not_logged_in'] ) && $this->options['frontpage_not_logged_in'] > 0 ){
				$this->show_page_on_front = true;
			}			
			
			if( $this->show_page_on_front ){
				add_action( 'pre_option_show_on_front', array( $this, 'pre_option_show_on_front' ), 10, 3 );
			}
			
			if( isset( $this->options['forced_login_redir_url'] ) && ! empty( trim( $this->options['forced_login_redir_url'] ) ) ){
				add_filter( 'pur_forced_login_redirect', array( $this, 'pur_forced_login_redirect' ), 10, 1 );
			}
		}
		
		//takes care of redirection after login.
		add_filter( 'login_redirect', array( $this, 'login_redirect'), 10, 3 );
	}
	
	function login_redirect( $redirect_to, $requested_redirect_to, $user ){
		if( is_object( $user ) && property_exists( $user, 'roles') && count( $user->roles ) > 0 ){
			//-- redirect by user role.
			$user_roles = $user->roles;
			$user_role = array_shift($user_roles);	
			$option_name = 'homepage_' . $user_role;	
			if( isset( $this->options[$option_name] ) && $this->options[$option_name] > 0 ){
				$redirect_to = get_permalink( $this->options[$option_name]  );
			}			
		}
			
		return $redirect_to;
	}
	
	function pur_forced_login_redirect( $redirect_url ){
		return $this->options['forced_login_redir_url'];
	}
	
	function pre_option_show_on_front( $ret, $option, $default ){
		return 'page';
	}

	function get_user_role() {
		global $current_user;

		$user_roles = $current_user->roles;
		$user_role = array_shift($user_roles);

		return $user_role;
	}
	
	function get_homepage_for_logged_in_user(){
		if( is_user_logged_in() ){
			//--- check specific for role
			$option_name = 'homepage_' . $this->get_user_role();
			if( isset( $this->options[$option_name] ) && $this->options[$option_name] > 0 ){
				return $this->options[$option_name];
			}
			
			//--- check for 
			if( isset( $this->options['frontpage_logged_in'] ) && $this->options['frontpage_logged_in'] > 0 ){
				return $this->options['frontpage_logged_in'];
			}
		}
		
		return false;
	}
	
	function pre_option_page_on_front( $ret, $option, $defaul ){
		if( is_user_logged_in() ){
			$maybe = $this->get_homepage_for_logged_in_user();
			if( $maybe > 0 ){
				
				return $maybe;
			}	
		} else {
			if( isset( $this->options['frontpage_not_logged_in'] ) && $this->options['frontpage_not_logged_in'] > 0 ){
				return $this->options['frontpage_not_logged_in'];
			}				
		}
	
		return $ret;
	}
	
	function forced_login() {

		if ( ( defined( 'DOING_AJAX' ) && DOING_AJAX ) || ( defined( 'DOING_CRON' ) && DOING_CRON ) || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
			return true;
		}

		$queried_object_id = intval( get_queried_object_id() );
		if( 'always_public' == get_post_meta( $queried_object_id, 'pur_control', true ) ){
			return true;
		}

		if ( ! is_user_logged_in() ) {
			$schema = isset( $_SERVER['HTTPS'] ) && 'on' === $_SERVER['HTTPS'] ? 'https://' : 'http://';
			$url = $schema . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

			$whitelist = apply_filters( 'pur_forced_login_whitelist', $this->options['forced_login_whitelist'] );
			$whitelist_arr = explode("\n", $whitelist );
			$whitelist_arr = array_map('trim', $whitelist_arr );
			if( isset( $this->options['forced_login_redir_url'] ) && ! empty( trim( $this->options['forced_login_redir_url'] ) ) ){
				$whitelist_arr[] = $this->options['forced_login_redir_url'];
			}
		
			if( in_array( $url, $whitelist_arr ) ){
				return true;
			}

			if( count( $whitelist_arr) > 0 ){
				foreach( $whitelist_arr as $pattern ){
					$pattern = str_replace('?','[?]',$pattern);//escape ?

					if( fnmatch( $pattern, $url, FNM_NOESCAPE | FNM_PATHNAME | FNM_PERIOD ) ){
						return true;
					}
				}
			}

			$skip    = apply_filters( 'pur_forced_login_skip', false, $url );
			if( ! $skip ) {
				if ( preg_replace( '/\?.*/', '', $url ) !== preg_replace( '/\?.*/', '', wp_login_url() ) ) {
					$redirect_url = apply_filters( 'pur_forced_login_redirect', wp_login_url( $url ) );
					nocache_headers();
					wp_safe_redirect( ( $redirect_url ), 302 );
					exit;
				}			
			}
		} elseif ( function_exists( 'is_multisite' ) && is_multisite() ) {
			if ( ! is_user_member_of_blog() && ! current_user_can( 'setup_network' ) ) {
				wp_die( __( "No access to this site.", 'pur' ), get_option( 'blogname' ) . ' &rsaquo; ' . __( 'Error', 'pur' ) );
			}
		}
	}
	

	
}