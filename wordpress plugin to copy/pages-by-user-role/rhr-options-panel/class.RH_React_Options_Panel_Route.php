<?php

class RH_React_Options_Panel_Route extends WP_REST_Controller {	
	var $rest_base;
	var $options_varname;
	var $capability;
	function __construct( $args = array() ){	
		//------------
		$defaults = array(
			'rest_base'			=> 'rhr_options',
			'options_varname'	=> 'rhr_options',
			'capability'		=> 'manage_options'
		);
		foreach($defaults as $property => $default){
			$this->$property = isset($args[$property])?$args[$property]:$default;
		}
		//-----------
	}
	
	public function register_routes() {
		$version = '1';
		$namespace = 'rhrop/v' . $version;
		$base = $this->rest_base;
		
		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_item_permissions_check' ),
				'args'                => array(),
			),			
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'updat_item_permissions_check' ),
				'args'                => array(),
			),
		));			
	}
	
	function get_item( $request=array() ){
		$response = get_option( $this->options_varname );
		$response = is_array( $response ) ? $response : array() ;

		return $response;
	}
	
	function get_item_permissions_check( $request=array() ){

		return current_user_can( $this->capability );
	}
	
	function update_item( $r ){

		$options = $r->get_param('options');
		
		if( is_array( $options ) && count( $options ) > 0 ){
			$existing_options = get_option( $this->options_varname );
			$existing_options = is_array( $existing_options ) ? $existing_options : array() ;		
			foreach( $options as $name => $value ){
				$existing_options[$name] = $value;
			}

			update_option( $this->options_varname, $existing_options );	
		}
		
		return $this->send_ok( array(), 'all good' );
	}
	
	function updat_item_permissions_check(){
		return current_user_can( $this->capability );
	}

	function send_ok( $data=null,$message='' ){
		$response = array(
			'R' 	=> 'OK',
			'MSG'	=> $message,
			'DATA'	=> $data
		);
		return $response;
	}
	
	function send_error( $error_message, $data=null, $relogin=false ){
		$response = array(
			'R' 		=> 'ERR',
			'MSG'		=> $error_message,
			'DATA'		=> $data,
			'RELOGIN'	=> $relogin ? 1 : 0
		);
		return $response;
	}	
}