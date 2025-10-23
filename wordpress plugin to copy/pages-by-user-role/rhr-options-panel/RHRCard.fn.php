<?php

function RHRCard( $name, $content = array(), $args = array() ){
	$content = count( $content ) > 0 ? $content : 
				array(															
					(object)array(
						'component'		=> 'h3',
						'content'		=> sprintf('Content of %s',$name)
					),																
					(object)array(
						'component'		=> 'h3',
						'content'		=> 'Something nice goes here.'
					)											
				)
	;

	$body_name = 'panel_'.str_replace( '-', '_', $name );
	$body_name = strtolower( str_replace( ' ', '_', $body_name ) );

	if( isset( $args['help_image'] ) ){
		$output = (object)array(
			'component'		=> 'panelbodywithopenstate',
			'name'			=> $body_name,
			'title'		=> isset( $args['header'] ) ? $args['header'] : sprintf('Header of %s',$name),
			'_children'		=> array(
				(object)array(
					'component'	=> 'div',
					'className'	=> 'rhop-card-body-cont',
					'_children'	=> array(
						(object)array(
							'component'	=> 'div',
							'className'	=> 'rhop-card-body-left',
							'_children'	=> $content
						),
						(object)array(
							'component'	=> 'div',
							'className'	=> 'rhop-card-body-right',
							'_children'	=> array(
								(object)array(
									'component'	=> 'img',
									'src'		=> $args['help_image']
								)
							)
						)				
					)
				)
			)
		);	
	} else {
		$output = (object)array(
			'component'		=> 'panelbodywithopenstate',
			'name'			=> $body_name,
			'title'		=> isset( $args['header'] ) ? $args['header'] : sprintf('Header of %s',$name),
			'_children'		=> $content
		);	
	}
	
	if( isset( $args['footer'] ) ) {	
		if( false !== $args['footer'] ) {
			if( !is_string($args['footer']) ){
				$output->_children[] = 	(object)array(
					'component' 	=> 'CardFooter',
					'_children'		=> $args['footer']
				);				
			} else {
				if( !empty( $args['footer'] )){
					$output->_children[] = 	(object)array(
						'component' 	=> 'CardFooter',
						'_children'		=> array(
							(object)array(
								'component'		=> 'h5',
								'content'		=> $args['footer']
							),	
						)
					);		
				}		
			}		
		}
	} else {
		$output->_children[] = 	(object)array(
			'component' 	=> 'CardFooter',
			'_children'		=> array(
				(object)array(
					'component'		=> 'h5',
					'content'		=> sprintf('Footer of %s',$name)
				),	
			)
		);			
	}		
			
	//wrap in a panel?		
	$output = (object)array(
		'component'	=> 'Panel',
		'_children' => array(
			$output								
		)
	);
	
	return $output;
}