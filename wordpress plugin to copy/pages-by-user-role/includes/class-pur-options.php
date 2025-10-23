<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Dinah!' );
}

class PUR_Options {
	public static $options;

	public function __construct( $args = array() ) {
		$defaults = array(
			'id'                 => 'pur',
			'options_capability' => 'manage_options',
			'options_varname'    => 'pur_options',
			'open'               => false,
		);

		foreach ( $defaults as $property => $default ) {
			$this->$property = isset( $args[ $property ] ) ? $args[ $property ] : $default;
		}

		if ( ! current_user_can( $this->options_capability ) ) {
			return;
		}

		self::$options = get_option( $this->options_varname );
		self::$options = is_array( self::$options ) ? self::$options : array();
	}

	public static function get_option( $name, $default = '', $use_default = false ) {
		$value = isset( self::$options[ $name ] ) ? self::$options[ $name ] : $default;

		if ( $use_default ) {
			$value = ( '' == $value ) ? $default : $value;
		}

		return $value;
	}

	public static function get_taxonomies() {
		return self::get_option( 'taxonomies', array( 'category' ), true );
	}
}

return new PUR_Options();