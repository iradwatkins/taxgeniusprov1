<?php


class pur_rhr_options {
	public function __construct( $args = array() ) {
		$defaults = array(
			'id'                 	=> 'pur',
			'options_capability' 	=> 'manage_options',
			'options_varname'    	=> 'pur_options',
			'rest_base'				=> 'pur_options',
			'open'               	=> false,
		);

		foreach ( $defaults as $property => $default ) {
			$this->$property = isset( $args[ $property ] ) ? $args[ $property ] : $default;
		}

		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		

		require PUR_PATH . 'rhr-options-panel/load.pop.php';
		
		rh_register_php( 
			'rhr-options-panel', 
			PUR_PATH . 'rhr-options-panel/class.RHReactOptionsPanel.php', 
			'1.0.0.1' 
		);	
		
		rh_register_php( 
			'rhr-options-rest-api', 
			PUR_PATH . 'rhr-options-panel/class.RH_React_Options_Panel_Route.php', 
			'1.0.0.1' 
		);			

		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
		
		add_filter( 'rhr-options-pur_options', array( $this, 'options_for_rhr_options' ) );

		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
			
	}
	
	public function admin_menu() {
		add_menu_page(
			__( 'Pages by User Role', 'pur' ),
			__( 'Access Control', 'pur' ),
			$this->options_capability,
			$this->id,
			'',
			'dashicons-pages-by-user-role'
		);
	}	
	
	function plugins_loaded(){

		if( true ){
			do_action('rh-php-commons');

			new RHReactOptionsPanel(array(
				'id'					=> 'pur_options',  
				'options_varname'		=> $this->options_varname,
				'rest_base'				=> $this->rest_base,
				'resources_url' 		=> PUR_URL . 'rhr-options-panel/',
				'option_menu_parent'	=> $this->id,
				'page_title'			=> 'Settings',
				'menu_text'				=> 'Settings',
				'capability'			=> $this->options_capability,
				'menu_id'				=> 'pur'  
			));
			
		}
	}	
	
	function options_for_rhr_options( $t ){
		include 'rhr-options.php';
		return $t;
	}	
	
	function rest_api_init(){
		do_action('rh-php-commons'); 

		$controller = new RH_React_Options_Panel_Route(array(
			'rest_base'			=> $this->rest_base,  
			'options_varname'	=> $this->options_varname,   
			'capability'		=> $this->options_capability
		));
		$controller->register_routes(); 			
	}	
}

new pur_rhr_options();