<?php	
//defaults
$cat            = 'blog';       //Blog, Twitter etc
$feed_to_show   = 'general';    //general or specific index, usually team

$num_results    = 5;
$team           = null;
$team_nickname  = null;

if(isset($_GET['cat'])) {
  $cat  = $_GET['cat'];    
}

//Set Team by using Team variable passed into page
if(isset($_GET['team'])) {
    //show specific team
    $team_nickname  = strtolower($_GET['team']);
    
    $o_DataNbaTeams = get_instance_of('nbateams');
	$team           = $o_DataNbaTeams->get_team_key($team_nickname);
	$feed_to_show   = $team;
    $num_results    = 15;
}

///Set Class Names
if($team) {
    $data_feed_class = "DataFeedsBlogsByTeam";
} else {
    $data_feed_class = "DataFeedsBlogs";
} 
?>