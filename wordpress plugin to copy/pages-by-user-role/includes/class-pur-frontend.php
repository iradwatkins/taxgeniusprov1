<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Dinah!' );
}

class PUR_Frontend {
	public $current_user_excluded_post_ids = false;
	public $options;
	public $inverted_pur = false;
	public $uroles;

	public function __construct() {
		$this->options = get_option( 'pur_options' );
		$this->uroles = $this->get_uroles( false );
		$this->inverted_pur = isset( $this->options['inverted_pur'] ) && '1' == $this->options['inverted_pur'] ? true :false;

		add_action( 'init', array( $this, 'init' ) );
	}

	function init(){
		if(!$this->inverted_pur){
			
			add_filter('template_redirect',array($this,'template_redirect'));
			add_filter('the_content',array($this,'the_content'),10,1);
			add_filter('wp_nav_menu_args',array($this,'wp_nav_menu_args'),10,1);//default nav menu
			add_filter('wp_list_pages_excludes',array($this,'wp_list_pages_excludes'),10,1);//wp_list_pages
			add_filter('wp_list_categories',array($this,'wp_list_categories'),10,1);
			
			add_filter( 'posts_results', array( $this, 'posts_results' ), 10, 2 );
		}else{
			
			add_filter('user_has_cap', array( $this, 'user_has_cap' ), 10, 4);
		}

		add_filter('wp_get_nav_menu_items',array($this,'wp_get_nav_menu_items'),10,3);//nav menu
		add_action('parse_query',array($this,'parse_query'),10,1);
		add_action('pre_get_posts',array($this,'parse_query'),10,1);
		add_filter('the_comments',array($this,'get_comment'),10,2);

		if(is_admin())add_action('init',array($this,'_admin_menu'),9999);

		if (  class_exists( 'WC_Query' ) ){
			add_action( 'woocommerce_product_query', array( $this, 'woocommerce_product_query' ) );
		}

		if ( class_exists( 'Iconic_Woo_Account_Pages' ) ) {
			add_filter( 'iconic_wap_hidden_pages', array( $this, 'iconic_hidden_pages' ) );
		}
	}

	function posts_results( $posts, $query ){
		if( is_admin() ){
			return $posts;
		}
		
		if( $this->is_rest() ){
			return $posts;
		}
		
		if( defined('DOING_AJAX') && DOING_AJAX ){
			return $posts;
		}
		
		if( is_array( $posts ) && count( $posts ) > 0 ){
			$tmp = array();
			foreach( $posts as $p ){
				if( '1' == get_post_meta( $p->ID, 'pur_hide_in_frontend', true ) ){
				
				} else {
					$tmp[] = $p;
				}
			}
			return $tmp;
		}
		return $posts;
	}

    function is_rest() {
        if (defined('REST_REQUEST') && REST_REQUEST 
                || isset($_GET['rest_route']) 
                        && strpos( $_GET['rest_route'], '/', 0 ) === 0)
                return true;

        global $wp_rewrite;
        if ($wp_rewrite === null) $wp_rewrite = new WP_Rewrite();
            
        $rest_url = wp_parse_url( trailingslashit( rest_url( ) ) );
        $current_url = wp_parse_url( add_query_arg( array( ) ) );
        return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
    }

	function user_has_cap( $allcaps, $caps, $args, $wp_user ){
		if( 'edit_post' == $args[0] ){
			$excluded_categories = $this->current_user_excluded_categories();
			$terms = wp_get_post_terms( $args[2], 'category', array("fields" => "ids") );

			if( @array_intersect( $terms, $excluded_categories ) || in_array( $args[2], $this->current_user_excluded_post_ids() ) ){
				if( is_array($caps) && count($caps)>0 ){
					foreach( $caps as $cap ){
						$allcaps[ $cap ] = false ;
					}
				}
			}
		}

		return $allcaps;
	}

	function skip_restriction(){
		if($this->inverted_pur){
			if(is_admin()){
				return false;
			}else{
				return true;
			}
		}else{
			$pur_include_ajax = isset( $this->options['pur_include_ajax'] ) && intval( $this->options['pur_include_ajax'] ) ? true : false;
			if( $pur_include_ajax ){
				if(is_admin() && (!defined('DOING_AJAX') || !DOING_AJAX) ){
					return true;
				}else{
					return false;
				}
			}else{
				if(is_admin()){
					return true;
				}else{
					return false;
				}
			}
		}
	}

	function get_comment( $comments, $c_query ) {
		if ( $this->skip_restriction() ) {
			return $comments;
		}

		$options = $this->options;
		$comment_filtering = isset( $options['comment_filtering'] ) ? true : false;

		if ( $comment_filtering ) {
			$tmp = array();

			foreach ( $comments as $c ) {
				if ( $this->check_access( $c->comment_post_ID ) ) {
					$tmp[] = $c;
				}
			}

			$comments = $tmp;
		}

		return $comments;
	}

	function parse_query(&$arr){
		if($this->skip_restriction())return;
		if(@$arr->is_single||@$arr->is_page)return;
		if(!is_admin()) $this->template_redirect();

		//--------------------------------------------------------------------
		$post__in = $arr->get('post__in', array() );
		$post__not_in = $arr->get('post__not_in', array() );
		$post__not_in = is_array( $post__not_in ) ? $post__not_in : array();
		$post__not_in = array_merge( $post__not_in, $this->current_user_excluded_post_ids() );
		$post__not_in = array_diff( $post__not_in, array(0) );
		$post__not_in = array_unique( $post__not_in );


		if( !empty($post__in) ){
			$post__in = array_diff( $post__in, $post__not_in );
			if( empty($post__in) ){
				$post__in = array(0);
			}
			$arr->set('post__in', $post__in );

		}else if ( ! empty( $post__not_in ) ) {
			$arr->set( 'post__not_in', $post__not_in );
		}

		$arr->set('category__not_in', 	$this->current_user_excluded_categories() );
	}

	function woocommerce_product_query( $q ) {
		$this->parse_query( $q );
	}

	function wp_get_nav_menu_items($items, $menu, $args){
		if($this->skip_restriction())return $items;
		$exclude = $this->current_user_excluded_post_ids();
		$excluded_categories = $this->current_user_excluded_categories();
		foreach($items as $i => $item){
			if($item->type=='post_type' && in_array($item->object_id,$exclude)){
				if('1'==get_post_meta($item->object_id,'pur_show_in_nav',true))continue;
				unset($items[$i]);
			}else if($item->type=='taxonomy' && $item->object=='category' && in_array($item->object_id,$excluded_categories)){
				unset($items[$i]);
			}else if( $item->type=='taxonomy' ){
				
				$uroles = $this->get_uroles(false);
				
				switch( get_term_meta( $item->object_id, 'pur_control', true) ){
					case 'allow':
						$allow_roles = get_term_meta( $item->object_id, 'pur-available-roles' );
						if( count( array_intersect( $uroles, $allow_roles ) ) == 0 ){
							unset($items[$i]);
						} 

						break;
												
					case 'block';
						$block_roles = get_term_meta( $item->object_id, 'pur-blocked-roles' );
						if( count( array_intersect( $uroles, $block_roles) ) > 0 ){
							unset($items[$i]);
						}
						break;
				}
			
				
			}
		}
		return $items;
	}

	function wp_nav_menu_args($args){
		$exclude = isset($args['exclude'])?explode(',',$args['exclude']):array();
		$pur_exclude = $this->current_user_excluded_post_ids();
		foreach($pur_exclude as $excluded_id){
			if('1'==get_post_meta($excluded_id,'pur_show_in_nav',true))continue;
			$exclude[]=$excluded_id;
		}
		$args['exclude']=','.implode(",",$exclude);
		return $args;
	}

	function wp_list_pages_excludes($exclude_array){
		foreach( $this->current_user_excluded_post_ids() as $excluded_id){
			if('1'==get_post_meta($excluded_id,'pur_show_in_nav',true))continue;
			$exclude_array[]=$excluded_id;
		}
		return $exclude_array;
	}

	function wp_list_categories($str){

		$cats = $this->current_user_excluded_categories();
		if(count($cats)>0){
			$str.="<style>";
			foreach($cats as $cat_id){
				$str.=".cat-item.cat-item-$cat_id{display:none;}";
			}
			$str.="</style>";
		}
		return $str;
	}

	function get_uroles($for_sql=true){
		global $wpdb,$userdata;

		$userinfo = new WP_User(@$userdata->ID);

		$uroles = array();
		if(!is_null($userinfo)&&is_array($userinfo->roles)&&count($userinfo->roles)>0){
			foreach($userinfo->roles as $urole){
				if($for_sql){
					$uroles[]=sprintf("'%s'",$urole);
				}else{
					$uroles[]=$urole;
				}
			}
		}
		return $uroles;
	}

	function current_user_excluded_post_ids(){
		global $wpdb,$userdata;
		if(is_array($this->current_user_excluded_post_ids))return $this->current_user_excluded_post_ids;//query once.
		$also_exclude = array();
		$extrafilter = '';
		if(is_user_logged_in()){
			$uroles = $this->get_uroles(true);
			$uroles = empty($uroles)||!is_array($uroles)?  array("'undefined'") : $uroles ;
			if(count($uroles)>0){
				$extrafilter = "AND(M.post_id NOT IN (SELECT DISTINCT(post_id) FROM `{$wpdb->postmeta}` WHERE meta_key='pur-available-roles' AND meta_value IN (".implode(',',$uroles).")))";
				//--
				$sql = "SELECT DISTINCT(M.post_id) FROM {$wpdb->posts} P INNER JOIN `{$wpdb->postmeta}` M ON P.ID=M.post_id AND P.post_status='publish' WHERE M.`meta_key` LIKE 'pur-blocked-roles'";
				$sql.= "AND(M.post_id IN (SELECT DISTINCT(post_id) FROM `{$wpdb->postmeta}` WHERE meta_key='pur-blocked-roles' AND meta_value IN (".implode(',',$uroles).")))";
				$also_exclude = $wpdb->get_col($sql,0);
			}
		}
		$sql = "SELECT DISTINCT(M.post_id) FROM {$wpdb->posts} P INNER JOIN `{$wpdb->postmeta}` M ON P.ID=M.post_id AND P.post_status='publish' WHERE M.`meta_key` LIKE 'pur-available-roles' $extrafilter";
		$exclude = $wpdb->get_col($sql,0);
		//---
		$exclude = array_merge($exclude,$also_exclude);
		return empty($exclude)?array(0):$exclude;
	}

	function current_user_excluded_categories( &$tax_terms=array() ){
		$tax_terms = is_array($tax_terms) ? $tax_terms : array();

		$pur_roles = get_option('pur-category-roles');
		$pur_roles = is_array($pur_roles)?$pur_roles:array();

		$uroles = $this->get_uroles(false);

		$exclude = array();
		if( isset($pur_roles) && is_array( $pur_roles ) && count( $pur_roles ) > 0 ){
			foreach( $pur_roles as $taxonomy => $pur_roles_set ){
				$tax_terms[$taxonomy] = isset( $tax_terms[$taxonomy] ) ? $tax_terms[$taxonomy] : array() ;
				foreach($pur_roles_set as $term_id => $roles){
					if(count($roles)==0)continue;//no role set for category so no need to exclude.
					$r = array_intersect($roles,$uroles);
					if( 0==count($r) ){
						$exclude[]=$term_id;
						$tax_terms[$taxonomy][] = $term_id;
					}
				}
			}
		}

		return $exclude;
	}

	function the_content( $content ) {
		$access_data = $this->get_access_data();

		if ( $access_data && ! $this->check_access( $access_data['id'], $access_data['type'] ) ){
			return $this->no_access_the_content();
		}

		return $content;
	}

	function template_redirect() {

		if ( ! $access_data = $this->get_access_data() ) {
			if( is_post_type_archive() ){
				if(!$this->post_type_archive_check_access()){
					$this->no_access_post_type_archive();
				}
			}else{
				//post types with has_archive false do not pass test for is_post_type_archive

				global $wp_query;
				if( is_object( $wp_query ) && property_exists( $wp_query, 'query' ) ){
					if( is_array( $wp_query->query )  && isset( $wp_query->query['post_type'] ) ){
						//this is a post type archive with has_archive set to false. lets treat it the same as is_post_type_archive()
						if(!$this->post_type_archive_check_access()){
							$this->no_access_post_type_archive();
						}
					}
				}
			}
			return;
		}

		if( 'term' == $access_data['type'] ){
			if ( ! $this->check_access( $access_data['id'], $access_data['type'] ) ) {
				//$this->no_access_page( $access_data['id'], $access_data['type'] );
				$this->no_access_post_type_archive();
			}
		}

		if ( is_single() || is_page() ) {
			if ( ! $this->check_access( $access_data['id'], $access_data['type'] ) ) {		
				$this->no_access_page( $access_data['id'] );
			}
		}
	}

	function get_access_data() {
		$queried_object = get_queried_object();

		if ( ! $queried_object ) {
			return;
		}

		$data = array();

		switch ( get_class( $queried_object ) ) {
			case 'WP_Post' :
				$data['id'] = $queried_object->ID;
				$data['type'] = 'post';
				break;

			case 'WP_Term' :
				$data['id'] = $queried_object->term_id;
				$data['type'] = 'term';
				break;
		}

		return $data;
	}

	function no_access_post_type_archive() {
		$redir_url = isset( $this->options['cpur_archive_url_default'] ) && ! empty( $this->options['cpur_archive_url_default'] ) ? $this->options['cpur_archive_url_default'] : site_url('/');

		wp_redirect( $redir_url );
		die();
	}

	function post_type_archive_check_access() {
		global $userdata, $wp_query;

		$post_type = $wp_query->get( 'post_type' );

		if(!is_string($post_type)){
			//when post_type is an array, this check is not applicable.
			return true;
		}

		$option = sprintf( 'cpur_archive_%s', $post_type );
		$archive_roles = isset( $this->options[ $option ] ) && is_array( $this->options[ $option ] ) && count( $this->options[ $option ] ) > 0 ? $this->options[ $option ] : false;

		if ( false === $archive_roles ) {
			return true; // page is public.
		} else if ( is_user_logged_in() ) {
			$uroles = $this->get_uroles( false );

			$intersect = array_intersect( $archive_roles, $uroles );

			if ( count( $intersect ) > 0 ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	function check_access( $object_id, $type = 'post' ) {
		$pur_include_ajax = isset( $this->options['pur_include_ajax'] ) && intval( $this->options['pur_include_ajax'] ) ? true : false;
		if( !$pur_include_ajax ){
			if( defined('DOING_AJAX') && DOING_AJAX ){
				return true;
			}
		}		
		//--TODO move to a more appropiate location : handle frontend entire custom post type restriction by role.
		//-- current beahivor, this will ignore the setting that allows non-logged users access until a real use case is presented.
		$post_type = get_post_type( $object_id ); //note, on a wc product page, $type is set to post
		$option_name = 'enable_fcpur_'.$post_type;
		if( isset( $this->options[$option_name] ) && 1==intval($this->options[$option_name]) ){
			//this post type is restricted to certain roles in the frontend.
			if( !is_admin() ){
				$allowed_post_type_roles = $this->options['fcpur_product'];
				if( empty($allowed_post_type_roles) ) return false; //nobody has access to this in the frontend.
				$uroles = $this->get_uroles( false );		
				$intersect = array_intersect( $allowed_post_type_roles, $uroles );				
				if ( count( $intersect ) > 0 ) {
					//-- user has access to this post type, continue checking other restrictions.
				} else {
					return false;
				}
			}
		}
		//-----
			
		if ( $this->is_blocked( $object_id, $type ) ) {
			return false;
		} elseif ( $this->is_allowed( $object_id, $type ) ) {
			return true;
		}
		return false;
	}

	function is_blocked( $object_id, $type ) {

		if( $this->is_always_blocked( $object_id, $type ) ){
			return true;
		} else if( $this->is_always_allowed( $object_id, $type ) ){
			return false;
		}

		$blocked_roles = WP_PUR::blocked_roles( $object_id, 'get', $type, '', true );

		if ( ! $blocked_roles ) {
			return false;
		} elseif ( ! is_user_logged_in() && ! $this->options['pur_allow_non_logged_in_users'] ) {
			return true;
		}

		return $this->check_uroles( $blocked_roles );
	}

	function is_allowed( $object_id, $type ){		
		if( $this->is_always_blocked( $object_id, $type ) ){
			return false;
		} else if( $this->is_always_allowed( $object_id, $type ) ){
			return true;
		}

		$allowed_roles = WP_PUR::available_roles( $object_id, 'get', $type, '', true );

		if ( ! $allowed_roles || ( ! is_user_logged_in() && $this->options['pur_allow_non_logged_in_users'] ) ) {
			return true;
		}

		return $this->check_uroles( $allowed_roles );
	}
	
	function is_always_allowed( $object_id, $type ){
		//-- handle username access first
		$usernames = get_post_meta( $object_id, 'pur_allowed_usernames', true );
		
		if( !empty( $usernames ) && is_user_logged_in() ){
			global $userdata;
			
			$users = array_map("trim",  explode(",", $usernames ) );
			$users = array_map("strtolower", $users );

			if( in_array( strtolower($userdata->user_login), $users ) ){
				return true;
			}		
		}
		//--
		return false;	
	}

	function is_always_blocked($object_id, $type){
		//-- handle username access first
		$usernames = get_post_meta( $object_id, 'pur_disallowed_usernames', true );
		if( !empty( $usernames ) && is_user_logged_in() ){
			global $userdata;
			
			$users = array_map("trim",  explode(",", $usernames ) );
			$users = array_map("strtolower", $users );
			
			if( in_array( strtolower($userdata->user_login), $users ) ){
				return true;
			}
		}
		//--
		return false;	
	}

	function check_uroles( $roles ) {
		if ( is_array( $this->uroles ) && $this->uroles ) {
			foreach ( $this->uroles as $urole ) {
				if ( in_array( $urole, $roles ) ) {
					return true;
				}
			}
		}

		return false;
	}

	function no_access_the_content() {
		return __( 'Restricted user content', 'pur' );
	}

	function no_access_page( $item_id, $item_type = 'post' ) {

		$options = get_option( 'pur_options' );

		if ( isset( $options['custom_redirect'] ) && '1' == $options['custom_redirect'] ) {

			die( $options['raw_html'] );
		}

		$redir_url = $this->get_item_meta( $item_type, $item_id, 'pur_redir_url', true );

		if ( is_string($redir_url) && '' == trim( $redir_url ) ) {
			$redir_url = isset( $options['redir_url'] ) ? $options['redir_url'] : '';
		}

		$login_redir = isset( $options['login_redir'] ) ? intval( $options['login_redir'] ) : 1;

		if ( ! is_user_logged_in() && $login_redir ) {
			$redir_url = site_url( '/wp-login.php?redirect_to=' . $_SERVER['REQUEST_URI'] );

			if ( headers_sent() ) {
				die( "<script>window.location='$redir_url';</script>" );
			}

			wp_redirect( $redir_url );
			die();
		} elseif ( trim( $redir_url ) != '' ) {

			if ( headers_sent() ) {
				die( "<script>window.location='$redir_url';</script>" );
			}

			wp_redirect( $redir_url );
			die();
		}

		wp_die( __( 'You don\'t have access to this page, contact the website administrator.', 'pur' ), 'No access' );
	}

	function _admin_menu(){
		global $wp_post_types, $pur_wp_post_types;
		$pur_wp_post_types = $wp_post_types;

		$options = get_option('pur_options');
		if(isset($options['disable_cpur'])&&$options['disable_cpur']=='1'){
			return;
		}

		if(is_array($wp_post_types)&&count($wp_post_types)>0){
			foreach($wp_post_types as $post_type => $pt){
				$option_name = "cpur_".$post_type;
				if(isset($options[$option_name])&&is_array($options[$option_name])&&count($options[$option_name])>0){
					$remove = true;
					foreach($options[$option_name] as $role_enabled){
						if(current_user_can($role_enabled)){
							$remove = false;
							break;
						}
					}
					if($remove){
						unset($wp_post_types[$post_type]);
					}
				}
			}
		}
	}

	function get_item_meta( $item_type, $item_id, $meta_name, $single = false ) {
		switch ( $item_type ) {
			case 'post' :
				return get_post_meta( $item_id, $meta_name, $single );
				break;
			case 'term' :
				return get_term_meta( $item_id, $meta_name, $single );
				break;
			case 'user' :
				return get_user_meta( $item_id, $meta_name, $single );
				break;
		}
	}

	function iconic_hidden_pages( $hidden ) {
		$child_posts = get_pages( array(
			'parent'         => get_option( 'woocommerce_myaccount_page_id' ),
			'posts_per_page' => -1,
		) );

		foreach ( $child_posts as $post ) {
			if ( ! $this->check_access( $post->ID, $post->post_type ) ) {
				$hidden[] = $post->post_name;
			}

		}

		return $hidden;
	}
}

return new PUR_Frontend();