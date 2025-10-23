<?php


class PUR_wp_admin_access {
	var $options = array();
	function __construct(){
		$this->options = get_option( 'pur_options' );
		
		if( isset( $this->options['pur_wp_admin'] ) && 1 == intval( $this->options['pur_wp_admin'] ) ){
			add_action( 'admin_init', array( $this, 'admin_init') );
		}
	}
	
	function admin_init(){	
		if ( ! $this->is_current_user_allowed() && ( ! wp_doing_ajax() ) ) {
			$url = $this->get_wp_admin_redir_url();
			wp_safe_redirect( $url );
			exit;
		}	
	}
	
	function is_current_user_allowed(){
		if( is_user_logged_in() ){
			$allowed_roles = $this->get_allowed_wp_admin();
	
			if( false===$allowed_roles ){
				//allowed roles where not set. do nothing. do not block (ret false.)
			} else {
				$user = wp_get_current_user();	
				if( array_intersect( (array) $user->roles, $allowed_roles) ){
				
				} else {
					//user has roles, but non mathces allowed roles.
					return false;
				}
			}
		}
		//note: will only block wp-admin if there are allowed roles set, and the user have roles.
		// if the user is not logged, regular auth will take care of the visitor.	
		return true;
	}
	
	function get_allowed_wp_admin(){
		if( isset( $this->options['allowed_roles_wp_admin'] ) && is_array( $this->options['allowed_roles_wp_admin'] ) && count( $this->options['allowed_roles_wp_admin'] ) > 0 ){
			return $this->options['allowed_roles_wp_admin'];
		}
		//no one was allowed.
		return false;
	}
	
	function get_wp_admin_redir_url(){
		if( isset( $this->options['wp_admin_redir_url'] ) && !empty( $this->options['wp_admin_redir_url'] ) ){
			$url = $this->options['wp_admin_redir_url'] ;
		} else {
			$url = site_url();
		}
		
		return $url;
	}
}

new PUR_wp_admin_access();



