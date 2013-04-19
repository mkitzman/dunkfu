<?php 
//php -q /home/dunkfu/public_html/dunkfu/odom/feeder.php
include 'lib/master.inc';         

/*
if(isset($_SERVER['SERVER_NAME'])) {
    $server = $_SERVER['SERVER_NAME'];
} else {
    $server = 'CRON JOB, NO SERVER';
}
$headers = 'From: dunkfu@dunkfu.com' . "\r\n" . 'Reply-To: dunkfu@dunkfu.com' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
$message = "SERVER " . $server . " TIME: " . date('D, d M Y H:i:s T', time());
mail('dunkfudragon@yahoo.com','Feed loaded',$message, $headers);
*/
$output_data = false; 
$get_data    = true; 

if(isset($_GET['od'])) {
  $output_data  = $_GET['od'];   
}

if($output_data) {
    ini_set('display_errors', '1');
	ini_set('error_reporting', E_ALL);
} else {
    ini_set('display_errors', '0');    
}

//'DataFeedsTwitterPlayer'        => array('hasteams' => false),
//'DataFeedsTwitterPlayerByTeam'  => array('hasteams' => true),
                    
$feeds_to_get = array(
                    'DataFeedsBlogs'                => array('hasteams' => false),
                    'DataFeedsBlogsByTeam'          => array('hasteams' => true),
                    //'DataFeedsTwitter'              => array('hasteams' => false),
                    //'DataFeedsTwitterByTeam'        => array('hasteams' => true),
                );
                

$o_DataNbaTeams = get_instance_of('nbateams');
$nba_teams      = $o_DataNbaTeams->get();

foreach ($feeds_to_get as $data_feed_class => $feed_info) {
    
    $o_DataFeeds     = get_instance_of($data_feed_class);	
    $group_title     = $o_DataFeeds->get_info('title');
    $rss_cache_time  = $o_DataFeeds->get_info('cache_time_cron');
    
    if($output_data) { 
        echo "<br>$data_feed_class <br>"; 
        echo "rss_cache_time: $rss_cache_time<br><br>";
    }
    
    if($feed_info['hasteams']) {
        
        foreach ($nba_teams as $team => $team_info) {
            $feed_to_show       = $team;
            $rss_feed_to_get    = $o_DataFeeds->get($feed_to_show);
            
            foreach ($rss_feed_to_get as $feed_key => $feed_data ) {
                if($output_data) { 
                    if(isset($feed_data['has_error']) && $output_data) { 
                        echo '!!!THIS FEED IS SET TO ERRORS: ';
                    }
                    if($feed_data['title']) {
                        $title = $feed_data['title'];
                    } else {
                        $title = 'NO TITLE';
                    }
                    if($feed_data['feed_url']) {
                        $feed_url = $feed_data['feed_url'];
                    } else {
                        $feed_url = 'No URL';
                    }

                    echo "Feed URL for " . $title . ": " . $feed_url . "<br>"; 
                }
                if($get_data) { 
                    $rss = fetch_rss($feed_data['feed_url']); 
                }
            }
            
        }
        
    } else {
        $feed_to_show   = 'general';
        $rss_feed_to_get    = $o_DataFeeds->get();
            
        foreach ($rss_feed_to_get as $feed_key => $feed_data ) {
            if($output_data) { 
                if(isset($feed_data['has_error']) && $output_data) { 
                    echo '!!!THIS FEED IS SET TO ERRORS: ';
                }
                if($feed_data['title']) {
                    $title = $feed_data['title'];
                } else {
                    $title = 'NO TITLE';
                }
                if($feed_data['feed_url']) {
                    $feed_url = $feed_data['feed_url'];
                } else {
                    $feed_url = 'No URL';
                }

                echo "Feed URL for " . $title . ": " . $feed_url . "<br>"; 
            }
            if($get_data) { $rss = fetch_rss($feed_data['feed_url'], $rss_cache_time); }
        }
    }
    
    
}
	
?>