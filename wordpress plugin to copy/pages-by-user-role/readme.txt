=== Pages by User Role for WordPress ===
Author: Alberto Lau (RightHere LLC)
Author URL: http://plugins.righthere.com/pages-by-user-role/
Tags: Access Control, User Roles, Hide Pages, Menu, Custom Post Types, Categories, WordPress, Restrict access to content, Allow access to content, Forced Login
Requires at least: 4.7
Tested up to: 6.5.2
Stable tag: 1.7.2.101119


======== CHANGELOG ========
Version 1.7.2.101119 - April 16, 2024
New Feature: Add always Allow Usernames and always Disallow Usernames access control. Access by username has higher priority than access by user role.

Version 1.7.1.10456 - July 4, 2022
New Feature: Added support for allowing specific usernames to login. Is useful if you need to perform maintenance on your website and only want specific users to access your website (wp-admin).

Version 1.7.0.10317 - May 6, 2022
New Feature: Added an option to hide a post (custom post type) from the frontend, but continue to show in wp-admin, Ajax, and REST API. Use case: Hiding a course from the frontend of the website, but still showing the course inside the BuddyBoss App. 
New Feature: Added Integrations tab to Settings. Allows the Administrator to toggle ON/OFF the hide in frontend setting in the Access Control metabox.
New Feature: Added status message in post list (Access Control column)


Version: 1.6.5.100179 - October 29, 2021
Bug Fixed: When a role is blocked from the front page, WooCommerce checkout Ajax crashes.

Version 1.6.4.99097 - May 6, 2021
* New Feature: Restrict an entire Post Type by User Role. This will ignore the option to allow non-logged in users access to restricted content. If the user role has access to the post type, other restrictions may still apply. Like when individual settings are set for an individual Post Type.

Version 1.6.3.99091 - May 4, 2021
* New Feature: Access to wp-admin by User Role.


Version 1.6.2.98892 - March 23, 2021
* Update: Use properly escaping in PHP
* New Feature: Set homepage by User Role

Version 1.6.0.98592 - February 26, 2021
* New Feature: Added new React based Options Panel to the plugin.
* Update: Converted all old features from Options Panel to new React based Options Panel
* Update: Used "strict mode" for all Javascript.
* Update: Removed empty folders
* New: Added new updated .pot file for translation (English)
* New: Added support for custom redirect Url when using Forced Login. 
* New: Added support for using wildcard /* in Forced Login white list.

Version 1.5.1.98183 - November 27, 2020
* Bug Fixed: Forced Login was causing the user to enter password twice.

Version 1.5.0.97742  - August 20, 2020
* New Feature: Forced Login. Make your website completely private
* New Feature: White-list Pages, Posts, and Custom Post Types (Always Visible) even though you have enabled the Forced Login feature
* New Feature: White-list URLs. This is useful if you want to white-list e.g. archives and categories when the Forced Login feature is enabled. 
* New Feature: Added support for settings a specific front-page for users not logged in and a front-page for users logged in. This feature can be used with or independently of the Forced Login feature.
* Bug Fixed: Block access to a Taxonomy term archive page


Version 1.4.7.97641 - August 17, 2020
* Compatibility Fix: Javascript error in Options Panel after upgrading to WordPress 5.5.

Version 1.4.6.96524 -  March 5, 2020
* Update: Added support for restricting access to Pages added to WooCommerce > My Account when using the WooCommerce Account Pages plugin (https://iconicwp.com/products/woocommerce-account-pages/)

Version 1.4.5.86663 - December 14, 2018
* Update: Styling improvements in Options Panel

Version 1.4.4.83225 - April 20, 2018
* Bug Fixed: PHP warning in the frontend
* Bug Fixed: PHP warning on IIS server

Version 1.4.3.82846 - February 7, 2018
* Compatibility Fix: Pages by User Role caused the content of blog posts on some websites to be hidden when using WordPress Notification plugin and Pages by User Role.

Version 1.4.2.82096 - November 11, 2017
* Bug Fixed: When blocking access to a Page for one specific User Role and allowing users that are not logged in to access the page, the remaining user roles were blocked. This was related to the new feature we just introduced.

Version 1.4.1.82080 - November 10, 2017
* New Feature: Added feature for handling users that are not logged in (General Settings)

Version 1.4.0.81397 - September 13, 2017
* Update: Added language folder and US English .po file

Version 1.3.9.80977 - August 3, 2017
* Bug Fixed: Issue with terms (array_unique)

Version 1.3.8.80492 - June 21, 2017
* Bug Fixed: The Post Type Archive option is not blocking access to post type archive pages in the frontend

Version 1.3.7.79512 - May 12, 2017
* Bug Fixed: Ajax adding terms (missed control for column’s content)

Version 1.3.6.78458 - April 12, 2017
* Bug Fixed: Term restrictions wasn’t working properly
* Bug Fixed: Issue with text when content restricted
* Bug Fixed: PHP warning when filtering out comments

Version 1.3.5.77856 - March 25, 2017
* Compatibility Fix: In some sites, a higher user roles got unchecked in the Access Control Box if lower user role edits the Post, Page or Custom Post Type

Version 1.3.4.76528 - January 30, 2017
* Bug Fixed: Default Redirect URL not working
* New Feature: Added support for Allowing or Blocking access to Posts assigned to specific Terms based on User Role

Version: 1.3.3.76125 - January 13, 2017
* Bug Fixed: Restrict content shortcodes broken after recent update

Version 1.3.2.75839 - December 29, 2016
* Bug Fixed: Restricting access to WooCommerce Shop page didn’t work properly
* Update: Added link to Help Center in Help tab

Version 1.3.1.75264 - November 17, 2016
* Bug Fixed: Restrictions for users not logged in
* Bug Fixed: Access Control column overwrites Taxonomy Images column
* Bug Fixed: Access Control not working properly for Topic in BBPress

Version 1.3.0.75207 - November 15, 2016
* New Feature: Added support for Custom Taxonomies

Version 1.2.9.69262 - April 9, 2016
* New Feature: Added support for BuddyPress
* New Feature: Added support for BBPress

Version 1.2.8.69096 - March 31, 2016
* Update: Changed order of Option Panel tabs
* Bug Fixed: post_type_enabled fixed getting post_type name
* Compatibility Fix: Added check for WooCommerce Shop, Cart, My Account and Checkout) to avoid PHP warning.

Version 1.2.7.68965 - March 26, 2016
* Compatibility Fix: Change classes where the constructor has the same name as the class to __construct (PHP 7 compatibility).
* New Feature: Allow restricting access to WooCommerce pages Shop, Cart, My Account and Checkout (restrictions for WooCommerce Custom Post Type archive page)
* Update: Updated Options Panel to version 2.8.3

Version 1.2.6.67786 - February 11, 2016
* Compatibility Fix: An undetermined third party plugin is causing a PHP warning
* New Feature: Added option to include filtering in the Ajax (Usage: Javascript loaded posts that use wp-admin/admin-ajax.php in the front end).

Version 1.2.5.58443 - April 24, 2015
* Improvement: Replaced add_query_arg() due to an XSS vulnerability issue that affects many WordPress plugins and themes. Please observe that before the function could be accessed the user had to be an Administrator, meaning that the potential issue was not available to the public.

Version 1.2.4.55151 - January 6, 2015
* Bug Fixed: When blocked post id’s make the query result empty, the blocked posts are not blocked at all.

Version 1.2.3.54781 - November 19, 2014
* Compatibility Fix: BBpress topic not shown, replies show when put is active

Version 1.2.2.54690 - November 8, 2014
* New Feature: Advanced option to out a custom HTML/Javascript when a page is restricted to the user
* New Feature: Restrict Post Type Archive by User Role, which allows you to restrict access to Post Type Archives by User Role and set an independent redirect URL for it
* Bug Fixed: Disappearing Options Tab
* Bug Fixed: When using inverted PUR the edit post link in the toolbar was still visible, and the user can actually bypass the restriction and edit the post.
* Compatibility Update: WooCommerce product pages 

Version 1.2.1 rev47835 - March 17, 2014
* Bug Fixed: Handle a situation where under some buggy conditions, output have been already sent by the site, before it should, and thus breaking redirection.
* Bug Fixed: Removed php warnings
* New Feature: Added a setting to restrict what user roles will be able to view the “Access Control” Metabox.
* New Feature: Experimental Inverted PUR functionality

Version 1.2.0 rev22604 - March 6, 2012
* New Feature: pur_not_logged_in shortcode for showing content only to visitors NOT logged in.
* New Feature: Enable Administrator to allow or block access to user roles (previously was only allow)
* New Feature: Show in menu when restricted post type
* New Feature: In the list of posts, in the Access Control column show if PUR is Allowing or Denying access to listed roles
* New Feature: Show Allow as Green and Deny as Red.
* Bug Fixed: Avoid a crash with Options Panel version 2

Version 1.1.8 rev14552 - December 19, 2011
* Update: Enabled WordPress 3.3 functionality

Version 1.1.7 rev11497 - December 10, 2011
* Bug Fixed: pur_restricted Shortcode was not rendering Shortcodes in the content
* New Feature: pur_restricted Shortcode now allow alternative text with HTML.

Version 1.1.6 rev9091 - September 26, 2011
* New Feature: No Access behavior customization. Admin can specify if a restricted page should redirect to login or to redirect URL.
* Bug Fixed: Adjust the redirect URL field in the metabox
* Bug Fixed: Added missing registration service library

Version 1.1.5 rev7652 - August 8, 2011
* New Feature: Built-in Shortcode pur_restricted to restrict access to certain sections of the content by capability; defaults to view_restricted-content but any capability
* Updated Options Panel updated
* New Feature: No access behavior customization. Admin can specify if a restricted page should redirect to login or to redirect URL.
* New Feature: Custom Post Types by User Role. This only shows if there are custom post types.
This is a mini-plugin itself that adds the following functionality:
In the tab option it shows a list of custom post types, and checkboxes of all the existing user roles for each custom post type.
By checking a user role for a custom post type you are restricting admin access to that post type only to the checked user role.

VERY IMPORTANT: Always check the Administrator. Note we do not do it by default, thus maybe the Administrator changed the the administrator user role, so we don't really know what the administrator role is.

In the case of incorrectly setting the administrator user role, there is an option on the same tab to disable this feature an recover access to the custom post types.

Version 1.1.4 rev4375 - May 7, 2011
* Bug Fixed: After setting user roles in Category and removing all, all roles where denied access afterwards.

Version 1.1.3 rev 2526 - March 24, 2011
* New feature, added comment filtering to comments fetch with the wp method get_comments (recent comments widget)

Version 1.1.2 rev 1863 - March 1, 2011
* Changed the procedure for redirect;
     1) the custom url
     2) the default url
     3) the login page
     4) if you are logged in and do not have access, an error message is shown.

Version 1.1.1 - February 8, 2011
* Fixed broken default redirect URL
* Fixed Post and Post redirect URL

Version 1.1.0 - February 3, 2011
* Added support for non standard WordPress table pre-fix
* Added support for access control to Categories
* Categories with access control are not searchable (unless you have access)
* Restrict access to Post by using the Posts ID.
* Category will not show in the menu if restricted access

Version 1.0.0 - November 3, 2010
* First release.


======== DESCRIPTION ========

With Pages by User Role, you can allow or restrict access to Pages, Posts, Custom Post Types, and Post Archives based on the visitors User Role. You can also create a private website where you force all visitors to login. You can set a homepage for visitors that are not logged in and for visitors that are logged in.

======== SUPPORT ==========
If you are stuck or experience an issue you can contact us using our Live Chat on https://righthere.com/support/

You can also visit our Knowledge Base for more information on https://kb.righthere.com.


== INSTALLATION ==

1. Upload the 'pages-by-user-role' folder to the '/wp-content/plugins/' directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Click on 'Pages by User Role' in the left admin bar of your dashboard

== Frequently Asked Questions ==

Q: Can I hide a Page from the menu when a user is not logged in?
A: Yes, if you choose to restrict access to a Page, Post or Custom Post Type then the page will NOT show in the menu.

Q: What happens if I don't set a redirect URL and a user try to access a Page or Post they he or she doesn't have access to?
A: The user will get redirect to the default page saying "You don't have access to this page, contact the website administrator."

Q: Can I create a custom page that users will be redirect to if they don't have access?
A: Yes, you can create a custom page and then enter the URL either as the default redirect page. You can actually redirect user to an individual Page for every Post or Post you create.

Q: Can I provide access to more than one User Role to the same Page or Post?
A: Yes, simply by selecting more than one User Role in the "Page Access" box.


