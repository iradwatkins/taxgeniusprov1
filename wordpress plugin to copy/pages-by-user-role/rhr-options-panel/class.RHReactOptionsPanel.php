<?php


require_once 'RHRTopBar.class.php';
require_once 'RHRCard.fn.php';
require_once 'RHRSeparator.fn.php';

class RHReactOptionsPanel {
	var $id;
	var $option_varname;
	var $resources_path;
	var $resources_url;
	var $version = '1.0.0.5';
	function __construct($args=array()){
		//------------
		$defaults = array(
			'id'					=> 'rhr_options',
			'options_varname'		=> 'rhr_options',
			'api_url'				=> '/rhrop/v1/rhr_options/',
			'rest_base'				=> 'rhr_options',

			'resources_url'			=> plugins_url( '/', __FILE__ ),
			'option_menu_parent'	=> '',
			'page_title'			=> '',
			'menu_text'				=> '',
			'capability'			=> '',
			'menu_id'				=> '',
			
		);
		foreach($defaults as $property => $default){
			$this->$property = isset($args[$property])?$args[$property]:$default;
		}
		
		$this->api_url = '/rhrop/v1/' . $this->rest_base . '/';
		
		//-----------	
		add_action('admin_menu', array( $this, 'admin_menu'), 20 );
	}

	function admin_menu(){
		$page_id = add_submenu_page( 
			$this->option_menu_parent,
			$this->page_title ,
			$this->menu_text,
			$this->capability,
			$this->menu_id,
			array( $this, 'body' )
		);
		
		add_action( 'admin_head-'. $page_id, array( $this, 'head' ) );
	}
	
	function head() {
		wp_enqueue_script( 'rhr-options-panel', 	$this->resources_url . 'rhrop.js', array( 
			'wp-api', 
			'wp-i18n', 
			'wp-components', 
			'wp-element', 
			'wp-api-fetch',
			'lodash',

		), $this->version, true );
		wp_enqueue_style( 'rhr-options-panel', 		$this->resources_url . 'rhrop.css', array( 'wp-components' ) );


		wp_localize_script( 'rhr-options-panel', $this->id, array(
			'options'		 => $this->get_options(),
		) );
	}
	
	function body(){
		echo sprintf( '<div id="rh-options-panel-container" class="rh-options-panel-container" data-skeleton_varname="%s" data-api_url="%s"></div>', 
			$this->id,
			$this->api_url
		);
	}
	
	function get_options( $options=array() ){
		$options = apply_filters( 'rhr-options', $options, $this->id );
		$options = apply_filters( 'rhr-options-' . $this->id, $options );
		$options = $this->handle_empty_options( $options );
		return $options;
	}
	
	function handle_empty_options( $options ){
		if( empty( $options ) ){
			$options = (object)array(
				'component' => 'div',
				'className' => 'error notice',
				'_children' => array(
					(object)array(
						'component' => 'p',
						'content' => sprintf('Options panel definition is empty for this page ( panel id: %s )',$this->id)
					)
				)
			);
		}
		return $options;
	}
}