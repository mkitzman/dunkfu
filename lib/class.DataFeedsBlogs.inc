<?php

class DataFeedsBlogs {

    private $feed_info = array(
        'title'           => 'NBA Blogs',
        'cache_time_live' => 172800,
        'cache_time_cron' => 600,
    );
    
    private $feeds = array(
        'ball_dont_lie' => array(
            'title'       => 'Ball Don&#39;t Lie',
            'website_url' => 'http://sports.yahoo.com/nba/blog/ball_dont_lie',
            'feed_url'    => 'http://sports.yahoo.com/nba/blog/ball_dont_lie/rss.xml',
        ),
        // 'the_basketball_jones' => array(
        //     'title'       => 'The Basketball Jones',
        //     'website_url' => 'http://blogs.thescore.com/tbj',
        //     'feed_url'    => 'http://blogs.thescore.com/tbj/feed',
        // ), 
        'basketbawful' => array(
            'title'       => 'Basketbawful',
            'website_url' => 'http://basketbawful.blogspot.com',
            'feed_url'    => 'http://feeds.feedburner.com/Basketbawful',
        ),
        // 'bergerSphere ' => array(
        //     'title'       => 'BergerSphere, Ken Berger CBS Sports',
        //     'website_url' => 'http://ken-berger.blogs.cbssports.com/mcc/blogs/view/11838893',
        //     'feed_url'    => 'http://feeds.cbssports.com/cbssports/mcc/blogs/syndicate/rss/11838893',
        // ),        
        // 'both_teams_played_hard' => array(
        //     'title'       => 'Both Teams Played Hard',
        //     'website_url' => 'http://www.bothteamsplayedhard.net',
        //     'feed_url'    => 'http://www.bothteamsplayedhard.net/feed',
        // ),
        // 'chasing23' => array(
        //     'title'       => 'Chasing 23',
        //     'website_url' => 'http://chasing23.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/chasing23?format=xml',
        // ),        
        'dime' => array(
            'title'       => 'Dime',
            'website_url' => 'http://dimemag.com',
            'feed_url'    => 'http://dimemag.com/?feed=rss2',
            'has_error'  => true,
        ),    
        // 'eye_on_basketball' => array(
        //     'title'       => 'Eye on Basketball, CBS Sports',
        //     'website_url' => 'http://eye-on-basketball.blogs.cbssports.com/mcc/blogs/view/22748484',
        //     'feed_url'    => 'http://feeds.cbssports.com/cbssports/mcc/blogs/syndicate/rss/22748484',
        // ),       
             
        'fannation' => array(
            'title'       => 'FanNation Truth & Rumors',
            'website_url' => 'http://www.fannation.com/truth_and_rumors/nba',
            'feed_url'    => 'http://www.fannation.com/truth_and_rumors/rss/nba.xml',
        ),       
        // 'freedarko' => array(
        //     'title'       => 'FreeDarko',
        //     'website_url' => 'http://freedarko.blogspot.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/Freedarkocom',
        // ),       
        // 'full_court_nba' => array(
        //     'title'       => 'Full Court NBA',
        //     'website_url' => 'http://fullcourtnba.blogspot.com',
        //     'feed_url'    => 'http://fullcourtnba.blogspot.com/feeds/posts/default',
        // ),    
        'give_me_the_rock' => array(
            'title'       => 'Give Me The Rock',
            'website_url' => 'http://givemetherock.com',
            'feed_url'    => 'http://feeds.feedburner.com/GiveMeTheRock',
        ),
        'hang_time' => array(
            'title'       => 'Hang Time',
            'website_url' => 'http://hangtime.blogs.nba.com',
            'feed_url'    => 'http://hangtime.blogs.nba.com/feed',
            'true_hoop'   => true,
        ),
        'hardwood_paroxysm' => array(
            'title'       => 'Hardwood Paroxysm',
            'website_url' => 'http://www.hardwoodparoxysm.com',
            'feed_url'    => 'http://feeds.feedburner.com/hp4sharebros?format=xml',
            'true_hoop'   => true,
        ),
        'thehoopdoctors' => array(
            'title'       => 'Hoop Doctors',
            'website_url' => 'http://thehoopdoctors.com',
            'feed_url'    => 'http://thehoopdoctors.com/online2/feed/',
        ),        
        'hoopsaddict' => array(
            'title'       => 'Hoops Addict',
            'website_url' => 'http://www.hoopsaddict.com',
            'feed_url'    => 'http://www.hoopsaddict.com/feed',
        ),     
        // 'hoopspeak' => array(
        //     'title'       => 'Hoop Speak',
        //     'website_url' => 'http://hoopspeak.com',
        //     'feed_url'    => 'http://hoopspeak.com/feed',
        //     'true_hoop'   => true,
        // ),        
        'hoopsmanifesto' => array(
            'title'       => 'Hoops Manifesto',
            'website_url' => 'http://www.hoopsmanifesto.com',
            'feed_url'    => 'http://www.hoopsmanifesto.com/feed/rss.html',
        ),                
        // 'how_to_watch_sports' => array(
        //     'title'       => 'How To Watch Sports',
        //     'website_url' => 'http://howtowatchsports.com/category/basketball/',
        //     'feed_url'    => 'http://feeds.feedburner.com/HowToWatchSports?format=xml',
        // ),
        'inside_hoops' => array(
            'title'       => 'InsideHoops',
            'website_url' => 'http://www.insidehoops.com/blog',
            'feed_url'    => 'http://www.insidehoops.com/blog/?feed=rss2',
        ),  
        'interbasket' => array(
            'title'       => 'Interbasket.net',
            'website_url' => 'http://www.interbasket.net',
            'feed_url'    => 'http://www.interbasket.net/news/feed',
        ),  
        // 'kiss_the_rim' => array(
        //     'title'       => 'Kiss The Rim',
        //     'website_url' => 'http://www.kisstherim.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/kisstherim/JFRI?format=xml',
        // ),  
       
        
        // 'le_basketbawl' => array(
        //     'title'       => 'le basketbawl',
        //     'website_url' => 'http://www.lebasketbawl.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/Le_Basketbawl?format=xml',
        // ),  
        // 'love_in_the_time_of_lebron' => array(
        //     'title'       => 'Love in the Time of Lebron',
        //     'website_url' => 'http://loveinthetimeoflebron.blogspot.com',
        //     'feed_url'    => 'http://loveinthetimeoflebron.blogspot.com/feeds/posts/default',
        // ),          
        // 'mommatheregoesthatman' => array(
        //     'title'       => 'Momma There Goes That Man',
        //     'website_url' => 'http://mommatheregoesthatman.com',
        //     'feed_url'    => 'http://mommatheregoesthatman.com/feed',
        // ),          
        // 'nba_breakdown' => array(
        //     'title'       => 'The NBA Breakdown',
        //     'website_url' => 'http://thenbabreakdown.blogspot.com',
        //     'feed_url'    => 'http://thenbabreakdown.blogspot.com/feeds/posts/default',
        // ),   
        // 'nba_obsessed' => array(
        //     'title'       => 'NBA Obsessed',
        //     'website_url' => 'http://www.nbaobsessed.com',
        //     'feed_url'    => 'http://www.nbaobsessed.com/feed',
        // ),  
        
        'nbadraftblog' => array(
            'title'       => 'NBA Draft Blog',
            'website_url' => 'http://nbadraftblog.com',
            'feed_url'    => 'http://www.nbadraftblog.com/feed/rss.html',
        ),  
        'nba_offseason' => array(
            'title'       => 'NBA Off-Season',
            'website_url' => 'http://nbaoffseason.com',
            'feed_url'    => 'http://nbaoffseason.com/rss',
        ),  
        // 'ny_times_howard_beck' => array(
        //     'title'       => 'NY York Times, Howard Beck',
        //     'website_url' => 'http://topics.nytimes.com/top/reference/timestopics/people/b/howard_beck/index.html?inline=nyt-per',
        //     'feed_url'    => 'http://topics.nytimes.com/top/reference/timestopics/people/b/howard_beck/index.html?inline=nyt-per&rss=1',
        // ),
        // 'no_look_pass' => array(
        //                 'title'       => 'No Look Pass',
        //                 'website_url' => 'http://www.thenolookpass.com',
        //                 'feed_url'    => 'http://www.thenolookpass.com/feed/',
        //         ), 
        'off_the_dribble' => array(
            'title'       => 'Off the Dribble',
            'website_url' => 'http://offthedribble.blogs.nytimes.com',
            'feed_url'    => 'http://offthedribble.blogs.nytimes.com/?feed=rss2',
        ),             
        'pro_hoops_central' => array(
            'title'       => 'Pro Hoops Central',
            'website_url' => 'http://prohoopscentral.com',
            'feed_url'    => 'http://prohoopscentral.com/feed',
        ),    
        'sheridan_hoops' => array(
            'title'       => 'Sheridan Hoops',
            'website_url' => 'http://sheridanhoops.com',
            'feed_url'    => 'http://feeds.feedburner.com/SheridanHoops?format=xml',
        ),   
        // 'the_hoop_scene' => array(
        //     'title'       => 'The Hoop Scene',
        //     'website_url' => 'http://thehoopscene.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/TheHoopScene?format=xml',
        // ),   
        'the_painted_area' => array(
            'title'       => 'The Painted Area',
            'website_url' => 'http://thepaintedarea.blogspot.com',
            'feed_url'    => 'http://thepaintedarea.blogspot.com/feeds/posts/default',
            'true_hoop'   => true,
        ),     
        // 'plissken_at_the_buzzer' => array(
        //     'title'       => 'Plissken at the Buzzer',
        //     'website_url' => 'http://westcoastbasketball.blogspot.com',
        //     'feed_url'    => 'http://westcoastbasketball.blogspot.com/feeds/posts/default',
        // ),  
        'probasketballtalk' => array(
            'title'       => 'ProBasketballTalk',
            'website_url' => 'http://probasketballtalk.nbcsports.com',
            'feed_url'    => 'http://probasketballtalk.nbcsports.com/atom.xml',
        ),  
        'ridiculous_upside' => array(
            'title'       => 'Ridiculous Upside',
            'website_url' => 'http://www.ridiculousupside.com',
            'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/ridiculousupside?format=xml',
        ),       
        'sb_nation' => array(
            'title'       => 'SB Nation',
            'website_url' => 'http://www.sbnation.com/nba',
            'feed_url'    => 'http://feeds.sbnation.com/rss/commentary/4',
        ),   
        'a_screaming_comes_across_the_court' => array(
            'title'       => 'A Screaming Comes Across The Court',
            'website_url' => 'http://ascreamingcomesacrossthecourt.blogspot.com',
            'feed_url'    => 'http://ascreamingcomesacrossthecourt.blogspot.com/feeds/posts/default',
        ),
        'point_forward' => array(
            'title'       => 'SI Point Forward',
            'website_url' => 'http://nba.si.com/',
            'feed_url'    => 'http://nba.si.com/feed/',
        ),  
        // 'shoot_hoops' => array(
        //     'title'       => 'Shoot Hoops',
        //     'website_url' => 'http://www.shoot-hoops.com',
        //     'feed_url'    => 'http://feeds.feedburner.com/ShootHoops?format=xml',
        // ),     
        // 'sham_sports' => array(
        //     'title'       => 'Sham Sports',
        //     'website_url' => 'http://blog.shamsports.com',
        //     'feed_url'    => 'http://blog.shamsports.com/feeds/posts/default',
        // ),    
        'slam_online' => array(
            'title'       => 'Slam Online',
            'website_url' => 'http://slamonline.com/online/category/nba',
            'feed_url'    => 'http://slamonline.com/online/?feed=atom',
        ),
        'slam_online' => array(
            'title'       => 'A Stern Warning',
            'website_url' => 'http://www.asternwarning.com/articles/nba',
            'feed_url'    => 'http://feeds.feedburner.com/ASternWarning-NBA-NBL?format=xml',
        ),       
        'stein_line_live' => array(
            'title'       => 'Stein Line Live',
            'website_url' => 'http://espn.go.com/blog/marc-stein',
            'feed_url'    => 'http://espn.go.com/blog/feed?blog=marc-stein',
        ), 
         

        'true_hoop' => array(
            'title'       => 'True Hoop',
            'website_url' => 'http://myespn.go.com/nba/truehoop',
            'feed_url'    => 'http://espn.go.com/blog/feed?blog=truehoop',
        ),
        'yardbarker' => array(
            'title'       => 'YardBarker, NBA Rumors & Gossip',
            'website_url' => 'http://www.yardbarker.com/nba',
            'feed_url'    => 'http://www.yardbarker.com/rss/sport/3',
        ),
     );
  
  	////////////////
	//CODE TO only call one instance of this class
	////////////////
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
 
    public function get($array_key=null) {
        if($array_key && isset($this->feeds[$array_key]) ) {
            return $this->feeds[$array_key];
        } else {
		    return $this->feeds;
		}
    }
    
    public function get_info($array_key=null) {
        if($array_key && isset($this->feed_info[$array_key]) ) {
            return $this->feed_info[$array_key];
        } else {
		    return $this->feed_info;
		}
    }
};