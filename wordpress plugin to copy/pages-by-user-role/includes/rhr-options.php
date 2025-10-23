<?php

function _get_role_options(){
	global $wp_roles;
	$roles = $wp_roles->get_names();
	$role_options = array();
	foreach( $roles as $role => $role_name ){
		$role_options[] = (object)array(
			'label' => $role_name,
			'value'	=> $role
		);
	}
	return $role_options;
}

$dashboard = (object)array(
	'component' => 'div',
	'className'	=> 'rhop-dashboard rhop-main',
	'_children'	=> array(


		RHRCard(
			'pur-card-help',
			array(
				RHRSeparator(),
				(object)array(
					'component'=>'p',
					'_children'	=> array(
						(object)array(
							'component' => 'span',
							'content'	=> __( 'If you are stuck or need help please contact us using our ', 'pur' )
						),
						(object)array(
							'component'	=> 'a',
							'href'		=> 'https://righthere.com/support/',
							'content'	=> 'Live Chat.',
							'target'	=> '_BLANK'
						)

					)
				),
				RHRSeparator()
			),

			array(
				'header' => __('Help','pur'),
				'footer' => array(
					RHRSeparator()
				),
				'help_image' => PUR_URL . 'assets/pur-icon-digital-customer-service-1@140x140.svg'
			)
		),

		RHRCard(
			'pur-card-kb',
			array(
				RHRSeparator(),
				(object)array(
					'component'=>'p',
					'_children'	=> array(
						(object)array(
							'component' => 'span',
							'content'	=> __( 'Find quick answers to your questions in our ', 'pur' )
						),
						(object)array(
							'component'	=> 'a',
							'href'		=> 'https://kb.righthere.com/docs/pages-by-user-role/',
							'content'	=> 'knowledge base.',
							'target'	=> '_BLANK'
						)

					)
				),
				RHRSeparator()
			),

			array(
				'header' => __('Knowledge Base','pur'),
				'footer' => array(
					RHRSeparator()
				),
				'help_image' => PUR_URL . 'assets/pur-icon-knowledge-base-1@140x140.svg'
			)
		),
	)
);

$settings_panel_general = (object)array(
	'title' => __( 'General', 'pur' ),
	'name'	=> 'settings-general',
	'description' => '',
	'_children' => array(
		RHRCard(
			'pur-general-settings',
			array(
				(object)array(
					'name'			=> 'pur_allow_non_logged_in_users',
					'component'		=> 'togglecontrol',
					'label'			=> __('Allow users not logged in access','pur'),
					'help_on'		=> __('Users that are not logged have access', 'pur'),
					'help_off'		=> __('Users that are not logged do NOT have access','pur')
				),
				(object)array(
					'component' 	=> 'CardDivider'
				),
				(object)array(
					'component' => 'p',
					'content'	=> __( 'Turn this feature ON when you want to allow access to users that are not logged in while blocking access to specific User Roles.', 'pur' )
				)
			),
			array(
				'header' => 'Access behavior',
				'footer' => ''
			)
		),

		RHRCard(
			'pur-general-redir',
			array(
				(object)array(
					'name'			=> 'redir_url',
					'component'		=> 'textcontrol',
					'label'			=> __('Default Redirect URL','pur'),
					'help' 	=> __('If a Page, Post or Custom Post Type does not have a redirect URL, users with no access to the Page, Post or Custom Post Type will get redirected to the default redirect URL.','pur')
				),
			),
			array(
				'header' => 'Default redirect',
				'footer' => array(
					(object)array(
						'component'	=> 'btnsave',
						'className' => 'rhrop-btn-card-save',
						'label'	=> __( 'SAVE', 'pur' )
					)
				)
			)
		),

		RHRCard(
			'pur-general-other',
			array(
				(object)array(
					'name'			=> 'comment_filtering',
					'component'		=> 'togglecontrol',
					'label'			=> __('Enable comment filtering. ','pur'),
					'help_on'		=> __('Comment filtering is enabled', 'pur'),
					'help_off'		=> __('Comment filtering is disabled', 'pur')
				),
				(object)array(
					'name'			=> 'pur_include_ajax',
					'component'		=> 'togglecontrol',
					'label'			=> __('Enable ajax filtering. ','pur'),
					'help_on'		=> __('Ajax filtering is enabled', 'pur'),
					'help_off'		=> __('Ajax filtering is disabled', 'pur')
				),
				(object)array(
					'name'			=> 'login_redir',
					'component'		=> 'togglecontrol',
					'label'			=> __('Redirect to login','pur'),
					'help_on'		=> __('Redirect non-logged user to login.', 'pur'),
					'help_off'		=> __('Redirect non-logged user to the defined redirect url.', 'pur'),
					'default'		=> 1
				),
				(object)array(
					'component' => 'p',
					'content'	=> __('If a visitor(not logged user) is trying to access a restricted page, check this option to redirect to login, or leave it unchecked to redirect to the defined redirect url.','pur')
				)

			),
			array(
				'header' => __('Other settings', 'pur'),
				'footer' => ''
			)
		)
	)
);

$settings_panel_access_control_metabox = (object)array(
	'title'	=> __( 'User Roles', 'pur' ),
	'name'	=> 'settings-access-control-metabox',
	'description' => '',
	'_children'	=> array(
		RHRCard(
			'pur-card-access-control-metabox',
			array(
				(object)array(
					'name'			=> 'restricted_metabox',
					'component'		=> 'togglecontrol',
					'label'			=> __('Restrict Access Control','pur'),
					//'help'			=> __('Choose yes and check the user roles that should get the Access Control metabox when editing a page/post.  By default all roles with edit capability get the Access Control Metabox.','pur'),
					'help_on'		=> __('Only checked User Role(s) can use the Access Control meta box.', 'pur'),
					'help_off'		=> __('By default all User Roles with edit capabilities can use the Access Control meta box.', 'pur'),
					'default'		=> 0,
					'_children'		=> array(
						(object)array(
							'component'	=> 'p',
							'content'	=> __('Check the User Role(s) that can use the Access Control meta box when editing a Post, Page, or Custom Post Type.','pur')
						),
						(object)array(
							'name'			=> 'allowed_metabox',
							'component'		=> 'checkboxescontrol',
							'options'		=> _get_role_options()
						)
					)
				),

			),
			array(
				'header'  => __( 'Access Control meta box', 'pur' ),
				'footer' => array(
					(object)array(
						'component'	=> 'btnsave',
						'className' => 'rhrop-btn-card-save',
						'label'	=> __( 'SAVE', 'pur' )
					)
				)
			)
		)
	)
);

$card_enable_for_wp_admin = RHRCard(
	'pur-enable-for-wp-admin',
	array(
		(object)array(
			'component'	=> 'p',
			'content'	=> __('The original behaviour of the plugin is to restrict content in the frontend, but not in the admin.  If you choose yes, the plugin will do the oposite:  restrict posts in the backend, but show them in the frontend.','pur')
		),
		(object)array(
			'name'			=> 'inverted_pur',
			'component'		=> 'togglecontrol',
			'label'			=>  __('Inverted PUR','pur'),
			'default'		=> 0,
			'help_on'		=> __( 'Restricting content in the backend (wp-admin), but not in the frontend', 'pur' ),
			'help_off'		=> __( 'Restricting content in the frontend, but not in the backend (wp-admin)', 'pur' )
		),
	),
	array(
		'header'  => __( 'Enable for wp-admin', 'pur' ),
		'footer' => ''
	)
);

$card_login_whitelist = RHRCard(
	'pur-login-whitelist',
	array(
		(object)array(
			'name'			=> 'login_whitelist',
			'component'		=> 'togglecontrol',
			'label'			=>  __('Maintenance','pur'),
			'default'		=> 0,
			'help_on'		=> __( 'Only usernames in the whitelist will be allowed to login', 'pur' ),
			'help_off'		=> __( 'Only allow specific usernames to login to your site while this feature is turned on', 'pur' ),
			'_children'		=> array(
				(object)array(
					'name'			=> 'login_whitelist_url',
					'component'		=> 'textcontrol',
					'label'			=> __('Maintanance Redirect URL','pur'),
					'help' 	=> __('Users that are not in the white list will be redirected to this url','pur')
				),	
				(object)array(
					'name'		=> 'login_whitelist_usernames',
					'component' => 'textareacontrol',
					'label'		=> __('Usernames white list','pur'),
					'rows'		=> 10,
					'default'	=> wp_get_current_user()->user_login,
					'help'		=> __('Specify one username per line (without commas) that will be allowed to login','pur')
				),						
			)
		),
	),
	array(
		'header'  => __( 'Maintanance', 'pur' ),
		'footer' => array(
					(object)array(
						'component'	=> 'btnsave',
						'className' => 'rhrop-btn-card-save',
						'label'	=> __( 'SAVE', 'pur' )
					)		
		)
	)
);

$settings_panel_advanced_options = (object)array(
	'title'			=> __('Advanced Options', 'pur' ),
	'name'			=> 'settings-advanced-options',
	'description'	=> '',
	'_children'	=> array(
		$card_login_whitelist,
		$card_enable_for_wp_admin,
		RHRCard(
			'pur-card-advanced-options',
			array(

				(object)array(
					'name'			=> 'custom_redirect',
					'component'		=> 'togglecontrol',
					'label'			=> __('Custom Redirect Behaviour','pur'),

					'help_on'		=> __('Override the redirect behavior', 'pur'),
					'help_off'		=> __('Disabled', 'pur'),
					'default'		=> 0,
					'_children'		=> array(
						(object)array(
							'name'		=> 'raw_html',
							'component'	=> 'textareacontrol',
							'label'		=> __('Raw html on redirect','pur'),
							'rows'		=> 10
						),

					)
				),
				(object)array(
					'component'	=> 'p',
					'content'	=> __('When a visitor does not have access to a page, the Raw html content will be sent to the browser. This can be html, javascript (propery encapsulated with script tags), etc.','pur')
				)
			),
			array(
				'header'  => __( 'Custom redirect' ,'pur' ),
				'footer' => array(
					(object)array(
						'component'	=> 'btnsave',
						'className' => 'rhrop-btn-card-save',
						'label'	=> __( 'SAVE', 'pur' )
					)
				)
			)
		)
	)
);

$settings_panel_custom_post_types_children = array();

function _usort_compare_post_type($a, $b) {
	return strcmp( $a->label, $b->label );
}

function _get_post_type_options(){
	$post_type_options = array();
	foreach(get_post_types(array('_builtin' => false),'objects','and') as $post_type => $pt){
		$post_type_options[] = (object)array(
			'label' => ( @$pt->labels->name ? $pt->labels->name : $post_type ),
			'value'	=> $post_type,
		);
	}



	usort( $post_type_options, "_usort_compare_post_type" );

	return $post_type_options;
}






$settings_panel_custom_post_types_children[] = RHRCard(
	'pur-card-post_types',
	array(
		RHRSeparator(),
		(object)array(
			'name'		=> 'enable_post_types',
			'label'		=> __('Enable Custom Post Types', 'pur'),
			'component'	=> 'togglecontrol',
			'help_on'	=> __( 'Choose the Custom Post Type(s) where you want the Access Control metabox to show.', 'pur' ),
			'default'	=> 0,
			'_children'	=> array(

				(object)array(
					'label'		=> '',
					'name'		=> 'post_types',
					'component' => 'checkboxescontrol',
					'options'	=> _get_post_type_options()
				)
			)
		),

	),
	array(
		'header' => 'Custom Post Types',
		'footer' => array(
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
				)
			),
			'help_image' => PUR_URL . 'assets/pur-icon-post-it-2@140x140.svg'
	)
);

function _frontend_cpur_nodes(){

	$post_type_options = _get_post_type_options();

	$out = array(
		(object)array(
			'component' => 'p',
			'content'	=> __( 'You can restrict access to an entire Custom Post Types by checking the user roles that should have access to it.  Please observe that unchecking a role does not mean that it will enable the post type for that role.', 'pur' )
		)
	);

	foreach( $post_type_options as $post_type ){

		$out[] = (object)array(
			'name'		=> sprintf("enable_fcpur_%s", $post_type->value ),
			'component' => 'togglecontrol',
			'label'		=> $post_type->label,
			'default'	=> 0,
			'_children'	=> array(
				(object)array(
					'name'		=> sprintf( "fcpur_%s",$post_type->value ),
					'component'	=> 'checkboxescontrol',
					'options'	=> _get_role_options()
				)
			)
		);
	}

	return $out;
}

$settings_panel_custom_post_types_children[] = RHRCard(
	'pur-card-frontend-cpt-restrict',
	_frontend_cpur_nodes(),
	array(
		'header' => __('Restrict access to post type (Frontend)','pur'),
		'footer' => array(
			(object)array(
				'component'	=> 'p',
				'content'	=> __( 'This option applies to the FRONTEND.', 'pur' )
			),
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)
		)
	)
);

function _cpur_nodes(){

	$post_type_options = _get_post_type_options();

	$out = array(
		(object)array(
			'component' => 'p',
			'content'	=> __( 'You can restrict access to certain Custom Post Types by checking the user roles that should have access to it.  Please observe that unchecking a role does not mean that it will enable the post type for that role.', 'pur' )
		)
	);

	foreach( $post_type_options as $post_type ){

		$out[] = (object)array(
			'name'		=> sprintf("enable_cpur_%s", $post_type->value ),
			'component' => 'togglecontrol',
			'label'		=> $post_type->label,
			'default'	=> 0,
			'_children'	=> array(
				(object)array(
					'name'		=> sprintf( "cpur_%s",$post_type->value ),
					'component'	=> 'checkboxescontrol',
					'options'	=> _get_role_options()
				)
			)
		);
	}

	return $out;
}

$settings_panel_custom_post_types_children[] = RHRCard(
	'pur-card-cpt-restrict',
	_cpur_nodes(),
	array(
		'header' => __('Restrict access to post type (Backend)','pur'),
		'footer' => array(
			(object)array(
				'component'	=> 'p',
				'content'	=> __( 'This option applies to the BACKEND.', 'pur' )
			),
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)
		)
	)
);



$settings_panel_custom_post_types_children[] = 		RHRCard(
			'pur-card-cpt',
			array(
				(object)array(
					'name'			=> 'disable_cpur',
					'component'		=> 'togglecontrol',
					'label'			=>  __( 'Disable Custom Post Type by Role', 'pur' ),
					'default'		=> 0,
					'help_on'		=> __( 'Custom Post Type restriction is disabled', 'pur' ),
					'help_off'		=> __( 'Custom Post Type restriction is enabled', 'pur' )
				),
				(object)array(
					'component'	=> 'p',
					'content'	=> __( 'Oops! If you have left out yourself from accessing a Custom Post Type, choose this option so the post type is visible again.', 'pur' )
				)
			),
			array(
				'header'  => __( 'Troubleshooting access to post type', 'pur' ),
				'footer' => array(
					(object)array(
						'component'	=> 'p',
						'content'	=> __( 'This option applies to the backend.', 'pur' )
					)
				)
			)
		);

function _frontend_post_type_archive_restrict(){
	$post_type_options = _get_post_type_options();

	$out = array(
		(object)array(
			'component' => 'p',
			'content'	=> __( 'You can restrict access to certain Custom Post Types by checking the user roles that should have access to it.  Please observe that unchecking a role does not mean that it will enable the post type for that role.', 'pur' )
		),
		(object)array(
			'component'	=> 'p',
			'content'	=> __( 'This option applies to the frontend.', 'pur' )
		)
	);

	foreach( $post_type_options as $post_type ){

		$out[] = (object)array(
			'name'		=> sprintf("enable_cpur_archive_%s",$post_type->value),
			'component' => 'togglecontrol',
			'label'		=> $post_type->label,
			'default'	=> 0,
			'_children'	=> array(
				(object)array(
					'name'		=> sprintf("cpur_archive_%s",$post_type->value ),
					'component'	=> 'checkboxescontrol',
					'options'	=> _get_role_options()
				)
			)
		);
	}

	return $out;
}

$settings_panel_custom_post_types_children[] = RHRCard(
	'pur-card-cpt-archive-restrict',
	_frontend_post_type_archive_restrict(),
	array(
		'header' => __('Post Type Archive','pur'),
		'footer' => array(
			(object)array(
				'component'	=> 'p',
				'content'	=> __( 'This option applies to the frontend.', 'pur' )
			),
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)
		)
	)
);

$settings_panel_custom_post_types = (object)array(
	'title'		=> __( 'Custom Post Types', 'pur' ),
	'name'		=> 'setings-custom-post-types',
	'_children' => $settings_panel_custom_post_types_children
);

function _get_taxonomy_options(){
	$taxonomy_options = array();

	$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
	foreach ( $taxonomies as $taxonomy => $tax ) {
		if ( ! in_array( $taxonomy, array( 'post_format' ) ) ) {
			$taxonomy_options[] = (object)array(
				'label'	=> $tax->labels->name,
				'value'	=> $taxonomy
			);
		}
	}

	return $taxonomy_options;
}

$taxonomy_card = RHRCard(
	'pur-card-taxonomy',
	array(
		RHRSeparator(),

		(object)array(
			'component'	=> 'togglecontrol',
			'name'		=> 'enable_taxonomies',
			'label'		=> __('Enable taxonomies','pur'),
			'help_on'	=> __('Choose the taxonomies that you want to control with the Access Control meta box.','pur'),
			'help_off'	=> __('Choose the taxonomies that you want to control with the Access Control meta box.','pur'),
			'_children'	=> array(
				(object)array(
					'component'	=> 'checkboxescontrol',
					'name'		=> 'taxonomies',
					'options'	=> _get_taxonomy_options()
				)
			)
		),




	),
	array(
		'header' => __('Link Taxonomies to PUR','pur'),
		'footer' => array(
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)
		)
	)
);

$settings_panel_taxonomies = (object)array(
	'title'		=> __( 'Taxonomies', 'pur' ),
	'name'		=> 'setings-taxonomies',
	'_children' => array(
		$taxonomy_card
	)
);


function _get_page_options(){
	$options = array();

	$args = array(
		'post_type'=>'page',
		'post_status'=>array('publish'),
		'orderby'=>'title',
		'order'=>'ASC',
		'nopaging'=>true,
		'numberposts'=>-1
	);

	$posts = get_posts($args);

	if(is_array($posts) && count($posts)>0){
	    $options[] = (object)array(
	    	'label'	=> __('--choose--','pur'),
	    	'value'	=> ''
	    );

		foreach($posts as $r){
			$options[] = (object)array(
				'label'	=> sprintf("%s (%s)", esc_html( $r->post_title ), esc_html( $r->post_status ) ),
				'value'	=> $r->ID
			);
		}
	}else{
	    $options[] = (object)array(
	    	'label'	=> __('No options','pur'),
	    	'value'	=> ''
	    );
	}

	return $options;
}

$forced_login_card = RHRCard(
	'pur-card-forced-login',
	array(

		(object)array(
			'name'		=> 'forced_login',
			'component'	=> 'togglecontrol',
			'label'		=> __('Enable forced login','pur'),
			'help_on'	=> __('Forced login enabled','pur'),
			'help_off'	=> __('Enabling this feature will force all users that visit your website to log in to view any content. You can override this behavior in the Access Control Metabox by choosing "Always Public."','pur') ,
			//'help'		=>
			'_children'	=> array(
				(object)array(
					'name'		=> 'forced_login_redir_url',
					'component' => 'textcontrol',
					'label'		=> __('Forced login redirect url','pur'),
					'help'		=> __('Enter a URL that you want to redirect non logged in users too. Leave empty if you want users that are not logged in redirected to the default login.','pur')
				),

				(object)array(
					'name'		=> 'forced_login_whitelist',
					'component' => 'textareacontrol',
					'label'		=> __('Forced login white list','pur'),
					'rows'		=> 10,
					'help'		=> __('Specify one URL per line that you do not want to force login. If you want to set a public homepage, remember to add your website URL to the whitelist field.','pur')
				),

				(object)array(
					'label'		=>  __('Select homepage for logged in users','pur'),
					'name'		=> 'frontpage_logged_in',
					'component'	=> 'selectcontrol',
					'options'	=> _get_page_options(),
					'default'	=> '',
					'help'		=> __('Selecting a homepage for logged in users will overwirte whatever is selected as the homepage in Settings > Reading.','pur'),
					'className'	=> 'widefat'
				),

				(object)array(
					'label'		=>  __('Select home page for non logged in users','pur'),
					'name'		=> 'frontpage_not_logged_in',
					'component'	=> 'selectcontrol',
					'options'	=> _get_page_options(),
					'default'	=> '',
					'help'		=> __('Selecting a homepage for non logged in users will allow you to show a different homepage to users that are not logged in.','pur'),
					'className'	=> 'widefat'
				)
			)
		),

	),
	array(
		'header' => __('Forced login','pur'),
		'footer' => array(
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)
			),
			'help_image' => PUR_URL . 'assets/pur-icon-enter-password-2@140x140.svg'
	)
);



$homepage_by_role_card_options = array();
$role_options = _get_role_options();
foreach( $role_options as $role ){	
	$homepage_by_role_card_options[] = (object)array(
		'label'		=>  sprintf( __('Homepage for role %s','pur'), $role->label ),
		'name'		=> 'homepage_'.$role->value,
		'component'	=> 'selectcontrol',
		'options'	=> _get_page_options(),
		'default'	=> '',
		'help'		=> sprintf( __('Choose a page to be the homepage of users with role %s','pur'), $role->value ),
		'className'	=> 'widefat'
	);
}

$homepage_by_role_card = RHRCard(
	'pur-by-role-homepage',
	$homepage_by_role_card_options,
	array(
		'header' => __('Homepage by Role','pur'),
		'footer' => array(		
			(object)array(
				'component'	=> 'btnsave',
				'className' => 'rhrop-btn-card-save',
				'label'	=> __( 'SAVE', 'pur' )
			)					
			),
			'help_image' => PUR_URL . 'assets/pur-icon-enter-password-2@140x140.svg'		
	)	
);

$settings_panel_forced_login = (object)array(
	'title'		=> __( 'Forced login', 'pur' ),
	'name'		=> 'setings-forced-login',
	'_children' => array(
		$forced_login_card,
		$homepage_by_role_card
	)
);

$settings_panel_wp_admin = (object)array(
	'title'	=> __( 'WP Admin', 'pur' ),
	'name'	=> 'settings-wp-admin',
	'description' => '',
	'_children'	=> array(
		RHRCard(
			'pur-card-wp-admin',
			array(
				(object)array(
					'name'			=> 'pur_wp_admin',
					'component'		=> 'togglecontrol',
					'label'			=> __('Restrict WP Admin Access','pur'),
					'help_on'		=> __('Only checked User Role(s) can use WP Admin.', 'pur'),
					'help_off'		=> __('By default all User Roles can access WP Admin.', 'pur'),
					'default'		=> 0,
					'_children'		=> array(
						(object)array(
							'component'	=> 'p',
							'content'	=> __('Check the User Role(s) that can use WP Admin','pur')
						),
						(object)array(
							'name'			=> 'allowed_roles_wp_admin',
							'component'		=> 'checkboxescontrol',
							'options'		=> _get_role_options()
						),
						(object)array(
							'name'			=> 'wp_admin_redir_url',
							'component'		=> 'textcontrol',
							'label'			=> __('No Access Redirect URL','pur'),
							'help' 	=> __('Roles that are not checked will be redirected to this url','pur')
						)						
						
					)
				),

			),
			array(
				'header'  => __( 'WP Admin Access', 'pur' ),
				'footer' => array(
					(object)array(
						'component'	=> 'btnsave',
						'className' => 'rhrop-btn-card-save',
						'label'	=> __( 'SAVE', 'pur' )
					)
				)
			)
		)
	)
);

$card_hide_in_frontend = RHRCard(
	'pur-hide-in-frontend',
	array(
		

		
		(object)array(
			'name'			=> 'hide_in_frontend',
			'component'		=> 'togglecontrol',
			'label'			=>  __('Hide in frontend','pur'),
			'default'		=> 0,
			'help_on'		=> __( 'The option to hide a post in the frontend is available and will show when editing a post, page or custom post type', 'pur' ),
			'help_off'		=> __( 'The option to hide a post in the frontend is NOT available', 'pur' )
		),
		
		(object)array(
			'component'	=> 'p',
			'content'	=> __('Use case: If you want to hide a course (LearnDash) from the frontend of your website, but still want to show the course inside the BuddyBoss App. The custom post type is still visible in wp-admin and accessible using Ajax, and REST API (if supported by the custom post type).','pur')
		),		
	),
	array(
		'header'  => __( 'Hide in frontend', 'pur' ),
		'footer' => array(
			(object)array(
				'component' => 'p',
				'content'	=> __('Turn this feature on if you want to hide the custom post type in the frontend.','pur')
			)
		)
	)
);

$settings_panel_integrations = (object)array(
	'title'	=> __( 'Integrations', 'pur' ),
	'name'	=> 'settings-integrations',
	'description' => '',
	'_children'	=> array(
		$card_hide_in_frontend
	)
);

$settings = (object)array(
	'component' => 'div',
	'className'	=> 'rhop-settings rhop-main',
	'_children'	=> array(
		(object)array(
			'id'		=> 'settings-tabpanel',
			'component'	=> 'tabpanel',
			'className' => 'tablist-spaced',
			'_children'	=> array(
				$settings_panel_general,
				$settings_panel_access_control_metabox,
				$settings_panel_advanced_options,
				$settings_panel_custom_post_types,
				$settings_panel_taxonomies,
				$settings_panel_forced_login,
				$settings_panel_wp_admin,
				$settings_panel_integrations
			)
		)
	)
);

$topbar = new RHRTopBar( array(
	'id'		=> 'rhrop_pur_top_bar',
	'initialTabName' => 'pur-settings',
	'className'	=> 'rhop-pur-top-bar',
	'logo'		=> PUR_URL . 'rhr-options-panel/logo.png',
	'_children'	=> array(
		(object)array(
			'name'		=> 'pur-dashboard',
			'title'		=> __( 'Dashboard', 'pur' ),
			'_children' => array(
				$dashboard
			)
		),
		(object)array(
			'name'		=> 'pur-settings',
			'title'		=> __( 'Settings', 'pur' ),
			'_children'	=> array(
				$settings
			)
		)
	)
));


$t = (object)array(
	'id'		=> 'rhrop_pur_root',
	'component'	=> 'div',
	'className'	=> 'rhop-root',
	'_children'	=> array(
		$topbar
	)
);
