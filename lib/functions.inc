<?php

    function cleanString($string) {
        
        $string = htmlspecialchars($string);
        $string = htmlentities($string);
        $string = str_replace('‘', '', $string );
        $string = str_replace('’', '&#039;', $string );
        $string = str_replace('?', '', $string );
        
        return $string;
    
    }

	// This is easier than typing "echo WEB_ROOT"
	function WEBROOT()
	{
		echo WEB_ROOT;
	}
    
    
    /////////////////////////
    ///Get DEV/PROD based URL
    /////////////////////////
    function  get_url($cat=NULL, $team=NULL, $player=NULL) {
        /*
        / or index.php
        /twitter/ or index.php?cat=twitter
        /team/Lakers or index.php?team=Lakers
        /twiter/team/lakers or index.php?cat=twitter&team=Lakers
        */
        
        switch ($cat) {
            case "about":
                if(IS_PROD) {
                    $query_string = "/About";
                } else {
                    $query_string = "/about.php";
                }
                break;
            case "blog":
                if($team && IS_PROD) {
                    $query_string = "/blog/team/$team";
                } else if (!$team && IS_PROD) {
                    $query_string = "/blog";
                } else if ($team) {
                    $query_string = "/index.php?cat=blog&team=$team";
                } else {
                    $query_string = "/index.php?cat=blog";
                }
                break;
            case "contact":
                if(IS_PROD) {
                    $query_string = "/Contact";
                } else {
                    $query_string = "/contact.php";
                }
                break;
            case "player":
                if($team && IS_PROD) {
                    $query_string = "/player/team/$team";
                } else if (!$team && IS_PROD) {
                    $query_string = "/player";
                } else if ($team) {
                    $query_string = "/index.php?cat=player&team=$team";
                } else {
                    $query_string = "/index.php?cat=player";
                }
                break;
            default:
                if($team && IS_PROD) {
                    $query_string = "/team/$team";
                } else if (!$team && IS_PROD) {
                    $query_string = "/";
                } else if ($team) {
                    $query_string = "/index.php?cat=blog&team=$team";
                } else {
                    $query_string = "/index.php?cat=blog";
                }
                break;
        }   
        $url = WEB_HOME . $query_string;
        
        return $url;
    }
    
    /////////////////////////
    ///Get Instance of A Class
    /////////////////////////
    function  get_instance_of($class=null) {
        
        switch ($class) {
            case "DataFeedsBlogs":
                return DataFeedsBlogs::getInstance();
                break;
            case "DataFeedsBlogsByTeam":
                return DataFeedsBlogsByTeam::getInstance();
                break;

            case "Feeds":
                return Feeds::getInstance();
                break;
                                
            case "nbateams":
                return DataNbaTeams::getInstance();
                break;
            default:
                return DataFeedsBlogs::getInstance();
                break;
        }
    }
        
	// Class Autloader
	function __autoload($class_name)
	{
	    //require DOC_ROOT . '/lib/class.' . strtolower($class_name) . '.inc';
		require DOC_ROOT . '/lib/class.' . $class_name . '.inc';
	}
	
?>