<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Dinah!' );
}

class PUR_Taxonomies {
	public function __construct() {
		add_action( 'admin_init', array( $this, 'edit_tags' ) );
		add_action( 'edit_terms', array( $this, 'edit_terms' ) );
	}

	private function taxonomy_enabled( $taxonomy ) {
		$taxonomies = PUR_Options::get_taxonomies();

		return in_array( $taxonomy, $taxonomies );
	}

	public function edit_tags() {
		global $taxnow;

		if ( $taxnow ) {
			$taxonomy = $taxnow;
		} elseif ( isset( $_REQUEST['taxonomy'] ) && taxonomy_exists( $_REQUEST['taxonomy'] ) ) {
			$taxonomy = $_REQUEST['taxonomy'];
		} else {
			$taxonomy = '';
		}

		if ( $taxonomy  && $this->taxonomy_enabled( $taxonomy ) ) {
			add_action( $taxonomy . '_edit_form_fields', array( $this, 'edit_form_fields' ), 10 );

			add_filter( 'manage_edit-' . $taxonomy . '_columns', array( 'WP_PUR', 'add_columns' ) );
			add_filter( 'manage_' . $taxonomy . '_custom_column', array( $this, 'custom_taxonomy_column' ), 10, 3 );
		}
	}

	public function edit_terms( $term_id ) {
		if ( empty( $_POST['_wpnonce_pur-edit-term'] ) || ! wp_verify_nonce( $_POST['_wpnonce_pur-edit-term'], 'pur-edit-term-' . $term_id ) ) {
			return;
		}

		$pur_roles = isset( $_POST['pur_roles'] ) && is_array( $_POST['pur_roles'] ) ? $_POST['pur_roles'] : array();

		WP_PUR::available_roles( $term_id, 'delete', 'term' );
		WP_PUR::blocked_roles( $term_id, 'delete', 'term' );

		if ( $pur_roles ) {
			foreach ( $pur_roles as $role ) {
				if ( isset( $_POST['pur_control'] ) ) {
					if ( 'block' === $_POST['pur_control'] ) {
						WP_PUR::blocked_roles( $term_id, 'add', 'term', $role );
					} elseif ( 'allow' === $_POST['pur_control'] ) {
						WP_PUR::available_roles( $term_id, 'add', 'term', $role );
					}
				}
			}
		}

		foreach ( array( 'pur_redir_url', 'pur_control' ) as $field ) {
			if ( isset( $_POST[ $field ] ) ) {
				update_term_meta( $term_id, $field, $_POST[ $field ] );
			}
		}
	}

	public function edit_form_fields( $term ) {
		global $wp_roles;

		$pur_control = get_term_meta( $term->term_id, 'pur_control', true );

		if ( 'block' === $pur_control ) {
			$pur_roles = WP_PUR::blocked_roles( $term->term_id, 'get', 'term' );
		} else {
			$pur_roles = WP_PUR::available_roles( $term->term_id, 'get', 'term' );
		}

		$pur_roles = isset( $pur_roles ) && is_array( $pur_roles ) ? $pur_roles : array();
		$roles = $wp_roles->get_names();

		wp_nonce_field( 'pur-edit-term-' . $term->term_id, '_wpnonce_pur-edit-term' );
		?>
		<tr class="form-field">
			<th scope="row" valign="top">
				<label><?php _e( 'Access Control', 'pur' ); ?></label>
			</th>
			<td>
				<fieldset>
					<label><input name="pur_control" type="radio" value="no_control" <?php checked( $pur_control, 'no_control' ); ?>> <?php _e( 'No Control', 'pur' ); ?></label>
					<br>
					<label><input name="pur_control" type="radio" value="allow" <?php checked( in_array( $pur_control, array( '', 'allow' ) ) ); ?>> <?php _e( 'Allow access to checked roles', 'pur' ); ?></label>
					<br>
					<label><input name="pur_control" type="radio" value="block" <?php checked( $pur_control, 'block' ); ?>> <?php _e( 'Block access to checked roles', 'pur' ); ?></label>
				</fieldset>
				<hr>
				<fieldset>
				<?php foreach ( $roles as $role_key => $role_name ) : ?>
					<label for="<?php echo esc_attr( $role_key ) ?>"><input id="<?php echo esc_attr( $role_key ) ?>" type="checkbox" name="pur_roles[]" value="<?php echo esc_attr( $role_key ); ?>" <?php checked( in_array( $role_key, $pur_roles ) ); ?>> <?php echo $role_name ?></label>
					<br>
				<?php endforeach; ?>
				</fieldset>
			</td>
		</tr>
		<?php
	}

	public function custom_taxonomy_column( $content, $column_name, $term_id ) {
		global $wp_roles;

		if ( 'pur' === $column_name ) {
			$content = __( 'No restrictions', 'pur' );
			$pur_control = get_term_meta( $term_id, 'pur_control', true );

			if ( 'block' === $pur_control ) {
				$control_label = __( 'Block', 'pur' );
				$label_color = 'red';
				$class_postfix = 'block';

				$pur_roles = WP_PUR::blocked_roles( $term_id, 'get', 'term' );
			} else {
				$control_label = __( 'Allow', 'pur' );
				$label_color = 'green';
				$class_postfix = 'allow';

				$pur_roles = WP_PUR::available_roles( $term_id, 'get', 'term' );
			}

			$pur_roles = isset( $pur_roles ) && is_array( $pur_roles ) ? $pur_roles : array();

			if ( $pur_roles ) {
				$wp_roles_names = $wp_roles->get_names();

				$roles = array();

				foreach ( $pur_roles as $pur_role ) {
					$roles[] = isset( $wp_roles_names[ $pur_role ] ) ? $wp_roles_names[ $pur_role ] : ucfirst( $pur_role );
				}

				if ( $roles ) {
					$content = sprintf( '<span style="color: %s;" class="pur-%s">%s:</span> %s',
						esc_attr( $label_color ),
						esc_attr( $class_postfix ),
						esc_attr( $control_label ),
						esc_html( implode( ', ', $roles ) )
					);

				}

			}
		}

		return $content;
	}
}

return new PUR_Taxonomies();