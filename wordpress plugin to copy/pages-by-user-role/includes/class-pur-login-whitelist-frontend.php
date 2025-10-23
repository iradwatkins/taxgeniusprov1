<?php


class PurLoginWhiteListFrontend {
	var $login_whitelist;
	var $login_whitelist_usernames;
	var $login_whitelist_url;
	function __construct(){
		$this->options = get_option( 'pur_options' );

		$this->login_whitelist = isset( $this->options['login_whitelist'] ) && '1' == $this->options['login_whitelist'] ? true :false;	
		if( $this->login_whitelist ){
			$this->login_whitelist_url = isset( $this->options['login_whitelist_url'] ) ? $this->options['login_whitelist_url'] : '';
			$this->login_whitelist_usernames = isset( $this->options['login_whitelist_usernames'] ) ? $this->options['login_whitelist_usernames'] : '';	
			$this->login_whitelist_usernames = $this->parse_usernames( $this->login_whitelist_usernames );
			
			if( !empty( $this->login_whitelist_url ) && is_array( $this->login_whitelist_usernames ) && count( $this->login_whitelist_usernames ) > 0 ){
				add_action( 'wp_loaded', array( $this, 'wp_loaded' ) );
			}
		}
		
	}
	
	function parse_usernames( $usernames ){
		$arr = array_filter( explode(PHP_EOL, $usernames ) );

		return $arr;
	}
	
	function wp_loaded(){  
        if (defined('REST_REQUEST') && REST_REQUEST 
                || isset($_GET['rest_route']) 
                        && strpos( $_GET['rest_route'], '/', 0 ) === 0)
                return true;
                
		if( defined('DOING_AJAX') && DOING_AJAX ){
			return true;
		}
		
		if( !is_user_logged_in() ){
			return true;
		}		
		
		global $userdata;
		
		if( in_array( $userdata->user_login, $this->login_whitelist_usernames )){
			return true;
		}
		
		if( is_admin() ){
			add_action( 'admin_init', array( $this, 'redirect') );
		} else {
			add_action( 'wp', array( $this, 'redirect') );
		}
	}
	
	function redirect(){	
		if( !is_admin() ){
			$post_id = url_to_postid( $this->login_whitelist_url );
			if( $post_id > 0 ){
				global $post;
				if( is_object( $post ) && property_exists( $post, 'ID') ){
					if( $post_id == $post->ID ){
						return true;
					}
				}
			}			
		}

		wp_safe_redirect( $this->login_whitelist_url );
		die();	
	}
}