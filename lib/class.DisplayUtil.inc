<?php
require('lib/magpie/rss_fetch.inc');

class DisplayUtil {
    
    /////////////////////////
    ///Web Site Header
    /////////////////////////
    public function site_head ($parameters=null) {
	    
	    
	    $o_DataNbaTeams         = get_instance_of('nbateams');
	    $nba_teams              = $o_DataNbaTeams->get();
	    
		$selected_class         = ' class="selected"';
	    $nba_selected_class     = "";
	    $twitter_selected_class = "";
	    $twitter_player_selected_class = "";
	    
	    $css_files              =  "<link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Kameron:700' >" . "\n";
        $css_files              .= '<link rel="stylesheet" type="text/css" href="' . WEB_HOME . '/css/site.css">' . "\n";
        
        $google_tracking        = "<script type=\"text/javascript\">var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-190904-1']);  _gaq.push(['_trackPageview']); (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })(); </script>\n";
    	
    	if(isset($parameters['page_title']) && $parameters['page_title']) {
    	    $pageTitle = $parameters['page_title'];
    	} elseif ($parameters['team'] )  {
    	    $title_team = $parameters['team'];
    	    $pageTitle = $nba_teams[$title_team]['name'] . " blogs on " . strtolower(SITE_NAME);
    	} else {
    	    $pageTitle = strtolower(SITE_NAME) . " - The NBA Blog Aggregator";
    	}
    	
    	if(isset($parameters['cat']) && $parameters['cat'] ) {
    	    $cat = $parameters['cat'];
    	} else {
    	    $cat = null;
    	}
    	if($cat == 'blog' ) {
		    $nba_selected_class     = $selected_class;
        } elseif($cat == 'twitter') {
		    $twitter_selected_class = $selected_class;
        } elseif($cat == 'player') {
		    $twitter_player_selected_class = $selected_class;
		}
     
        if(isset($parameters['extra_css']) && $parameters['extra_css']) {
            foreach ($parameters['extra_css'] as $css_file) {
                $css_files .= "\n".'<link rel="stylesheet" type="text/css" href="' . WEB_HOME . '/css/'.$css_file.'">'."\n";
            }
        }        
        
        if($parameters['team']) {
            $meta_keywords = $nba_teams[$title_team]['name'] . " Blogs " . $nba_teams[$title_team]['nickname'] . ' basketball blogs' . ' nba';
            $meta_description = $nba_teams[$title_team]['name'] . " blogs on " . strtolower(SITE_NAME) . ' - The go to source for NBA Blogs aggregation.';
        } else {
            
            $meta_description = strtolower(SITE_NAME) . ' is the go to source for NBA Blogs aggregation to help basketball junkies keep up to date on all of their favorite NBA teams.';
            $meta_keywords = "NBA Blogs Blog";
            foreach ($nba_teams as $key => $team_info) {
                $meta_keywords .= " " . $team_info['nickname'];
            }
        }
        
        header("Content-Type: text/html; charset=utf-8");
        mb_internal_encoding("UTF-8")
        ?>
        <!DOCTYPE html>
    		<html lang="en">
    			<head>
    	  			<title><?php echo $pageTitle; ?></title>
    	  			<meta http-equiv="content-type"     content="text/html; charset=utf-8">
    	  			<meta http-equiv=”content-language” content=”en-US” />
    	  			<meta http-equiv="window-target"    content="_top">
    	  			<meta name="description"            content="<?php echo $meta_description; ?>">
    	  			<meta name="keywords"               content="<?php echo $meta_keywords; ?>" >    
    	  			<meta property="og:title"           content="dunkfu" />
                    <meta property="og:type"            content="website" />
                    <meta property="og:url"             content="http://www.dunkfu.com" />                    
                    <meta property="og:description"     content="The go to source for NBA Blogs aggregation to help basketball junkies keep up to date on all of their favorite NBA teams." >
                    <meta name="viewport"               content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">  
                                         
                    <link rel="icon" href="<?php echo WEB_HOME; ?>/i/favicon.ico" type="image/x-icon" />
    	  			<link rel="shortcut icon" href="<?php echo WEB_HOME; ?>'i/favicon.ico" />

    	  			<?php echo $css_files; ?>
    	  			<?php echo $google_tracking; ?>
    	  		</head>
    	 		<body>
                    <header>
                        <div class="header">
                            <h1><a rel="index" href="<?php echo WEB_HOME; ?>">dunkfu</a></h1>
                            <h3>NBA Blog Aggregator</h3>
                            <nav>
                                <div class="site_nav nav">
                                    <ul>
                                        <li class="first"><a href="http://dunkfu.tumblr.com/rss">Photo RSS</a></li> 
                                        <li><a href="http://dunkfu.tumblr.com/archive">Photo Archive</a></li>
                                        <li><a rel="about" href="<?php echo get_url('about'); ?>">About</a></li>
                                        <li><a rel="contact" href="<?php echo get_url('contact'); ?>">Contact</a></li> 
                                        <li class="last"><a rel="index" href="<?php echo WEB_HOME; ?>">Home</a></li>
                                    </ul>
                                </div>
                            </nav>
                        </div> 
                    </header>
 		            <nav>
 		                <div id="secondary_nav" class="nav">
	 		                <ul id="section_nav">
                                <li<?php echo $nba_selected_class; ?>><a rel="index" href="<?php echo WEB_HOME; ?>" title="NBA Blogs">Blogs</a></li>
                                <?php /* <li<?php echo $twitter_selected_class; ?>><a href="<?php echo get_url('twitter'); ?>" title="NBA on Twitter">Twitter</a></li> */  ?>       
                                <li><a href="http://dunkfu.tumblr.com" title="NBA Photos">Photos</a></li>
                            </ul>
                    
                            <ul id="sub_nav">
                            <?php
                                foreach ($nba_teams as $key => $team_info) {
                    
                                    if(isset($parameters['team']) && $parameters['team'] == $key ) {
                                        $subnav_class = ' class="selected '.$team_info['abbreviation'].'"';
                                    } else {
                                        $subnav_class = ' class="'.$team_info['abbreviation'].'"';
                                    }
            
                                    $team_url = get_url($cat, $team_info['nickname']);
            
                                    echo '<li' . $subnav_class. '><a title="'.$team_info['name'].'" href="'. $team_url . '"><span></span>' . $team_info['abbreviation'] . '</a></li>' . "\n";
                                }
                            ?>
                            </ul>
                            
                            <div class="mobile_nav">
                                <form method="get" action="<?php echo WEB_HOME; ?>/index.php">
                                    <select name="team" onchange="this.submit()">
                                        <option value="">NBA</option>
                                        <?php
                                            foreach ($nba_teams as $key => $team_info) {
                                                if(isset($parameters['team']) && $parameters['team'] == $key ) {
                                                    echo '<option selected value="'.$team_info['nickname'].'">'.$team_info['name'] . '</option>';
                                                } else {
                                                    echo '<option value="'.$team_info['nickname'].'">'.$team_info['name'] . '</option>';
                                                }
                                            }
                                        ?>
                                    </select>
                                    <input type="submit" name="submit" value="Go">
                                </form>
                            </div>
                            
                        </div>
                    </nav>
        <?php
    }

    /////////////////////////
    ///Web Site Footer
    /////////////////////////
	public function site_foot() { 
            echo "</body>\n</html>";
	}
	
	
	/////////////////////////
	//CODE TO only call one instance of this class
	/////////////////////////
    private static $_instance = null;
 
    protected function __clone() {
        // restricts cloning of the object
    }
 
    static public function getInstance() {
        if(is_null(self::$_instance))
        {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
 
    public function import() {
        // ...
    }
 
    public function get($settingToGet) {
		$setting_value = $this->$settingToGet;
		return $setting_value;
    }

}    