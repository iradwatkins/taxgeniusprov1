<?php

class RHRTopBar {
	var $id;
	var $component = 'topbar';
	var $initialTabName;
	var $className = 'rhop-top-bar';
	var $logo = '';
	var $_children = array();
	
	function __construct( $args=array() ){
		$defaults = array(
			'id'					=> 'rhr_top_bar',
			'initialTabName'		=> '',
			'className'				=> 'rhop-top-bar',
			'logo'					=> '',
			'_children'				=> array()		
		);
		foreach($defaults as $property => $default){
			$this->$property = isset($args[$property])?$args[$property]:$default;
		}
	}
}