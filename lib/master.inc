<?php
///LOCKDOWN
// if(!strstr($_SERVER['REQUEST_URI'], 'feeder') ) {
//     if( !isset($_SERVER['HTTP_REFERER']) ) {
//         header( 'Location: http://www.dunkfu.com' ) ;
//     }
//     if( !strstr($_SERVER['HTTP_REFERER'], 'http://www.dunkfu.com') && !strstr($_SERVER['HTTP_REFERER'], 'http://dunkfu.com') ) {
//         header( 'Location: http://www.dunkfu.com' ) ;
//     }
// }


$production_servers = array('www.dunkfu.com', 'dunkfu.com');
$local_servers      = array('127.0.0.1', 'middlebone-lm.home');

// Pick appropriate settings based on which server we're running on
if(in_array($_SERVER['SERVER_NAME'], $production_servers)) {
	// Production servers
	define('WEB_ROOT', '/');
    define('IS_PROD', true);
    define('WEB_HOME', 'http://dunkfu.com');

	ini_set('display_errors', '0');
	
} elseif(in_array($_SERVER['SERVER_NAME'], $local_servers)) {
	// Local (testing) servers
	define('WEB_ROOT', '/');
    define('IS_PROD', false);
    define('WEB_HOME', 'http://127.0.0.1/~mkitzman/HostGator/dunkfu');
    
	ini_set('display_errors', '1');
	ini_set('error_reporting', E_ALL);
} else {
    ini_set('display_errors', '1');
	ini_set('error_reporting', E_ALL);
	//die('Where am I? (You need to setup your server names in master.inc.php) You might want to read our <a href="_masters/overview.html">quick overview</a> to get started.');
}


define('DOC_ROOT', realpath(dirname(__FILE__) . '/../'));
define('SITE_NAME', 'dunkfu');
define('SITE_NAME_FULL', 'dunkfu.com');

// Global include files
require DOC_ROOT . '/lib/functions.inc'; // __autoload() is contained in this file

// Fix magic quotes
if(get_magic_quotes_gpc())
{
	$_POST    = fix_slashes($_POST);
	$_GET     = fix_slashes($_GET);
	$_REQUEST = fix_slashes($_REQUEST);
}
require DOC_ROOT . '/lib/params.inc';

// Clean up the global namespace
unset($local_servers, $production_servers);


$o_DisplayUtil = DisplayUtil::getInstance();
?>