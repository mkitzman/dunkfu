<?php 
include 'lib/master.inc';         

$o_DisplayUtil->site_head( array('team' =>$team, 'cat' => $cat) );
///////////////////////////////////////////////
	
///Code to get the RSS feed
$o_DataFeeds = get_instance_of($data_feed_class);

$rss_feed_to_get    = $o_DataFeeds->get($feed_to_show);
$group_title        = $o_DataFeeds->get_info('title');
$rss_cache_time     = $o_DataFeeds->get_info('cache_time_live');

if($team) {
    $o_DataNbaTeams = get_instance_of('nbateams');
    $nba_teams      = $o_DataNbaTeams->get();
    $team           = $nba_teams[$team]['name'];
    $page_header    = "$team blogs";
} else {
    $page_header    = "$group_title";
}
?>
<section> 
    <div id="content" class="section">
        <h2><?php echo $page_header; ?></h2>   
        <ul>
            <?php
                foreach ($rss_feed_to_get as $feed_key => $feed_data ) {
      
                    if(!isset($feed_data['has_error'])) {

                        $rss  = fetch_rss($feed_data['feed_url'], $rss_cache_time);


                        if($rss && property_exists($rss, 'items')) {
                            
                            $rss_items_to_show  = array();
                            $loop_count         = 1;  
                            
                            foreach ($rss->items as $rss_item ) {
                                
                                if($loop_count == $num_results) { break; }
                                
                                $feed_date = null;
                                
                                if(isset($rss_item['title'])) {
                                    
                                    $rss_items_to_show[] = '<li><a target="new" rel="external" title="View post in a new window" href="' . $rss_item['link']. '">'. cleanString($rss_item['title']) . '</a></li>' . "\n";
                                    
                                    if(!$feed_date) {
                                        
                                        if (isset($rss_item['pubdate']) ) {
                                            $feed_date = 'Last Updated: ' . date("F j, Y, g:i a", strtotime($rss_item['pubdate']));
                                        } elseif(isset($rss_item['published']) ) {
                                            $feed_date = 'Last Updated: ' . date("F j, Y, g:i a", strtotime($rss_item['published']));
                                        } 
                                    }
                                    
                                    $loop_count++;
                                }
                            }
                            
                            if(!$feed_date) {                            
                                $feed_date = '<em>Publish Date not available</em>';
                            }
                            
            ?>
                            <li class="feed">
                                <h4><a href="<?php echo $feed_data['website_url']; ?>" target="new" rel="external" title="Open <?php echo $feed_data['website_url']; ?> in a new window"><?php echo $feed_data['title']; ?></a></h4>
                                <h5><?php echo $feed_date; ?></h5>
                                <ul>
                                    <?php
                                        foreach ($rss_items_to_show as $rss_item ) {
                                            echo $rss_item;
                                        }
                                    ?>
                                </ul>
                            </li>
            <?php
                        } //if($rss && property_exists($rss, 'items')) {
                    }   //if(!isset($feed_data['has_error'])) {
                } //foreach ($rss_feed_to_get as $feed_key => $feed_data ) {
            ?>
        </ul>
    </div>
</section>
<?php
    
///////////////////////////////////////////////
$o_DisplayUtil->site_foot(); 
?>
	