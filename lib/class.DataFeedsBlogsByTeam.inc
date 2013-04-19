<?php

class DataFeedsBlogsByTeam {

    private $feed_info = array(
        'title'           => 'NBA Blogs by Team',
        'cache_time_live' => 172800,
        'cache_time_cron' => 600,

    );
    
    private $feeds = array(
        'atlanta_hawks' => array(
            'hawks_blog' => array(
                'title'       => 'Hawks Blog, AJC.com',
                'website_url' => 'http://blogs.ajc.com/hawks',
                'feed_url'    => 'http://blogs.ajc.com/hawks/feed',
            ),
            // 'hawks_highlights' => array(
            //     'title'       => 'Hawks Highlights',
            //     'website_url' => 'http://hawkshighlights.com',
            //     'feed_url'    => 'http://hawkshighlights.com/feed/rss.html',
            //     'bloguin'     => true,
            // ),
            // 'hoopinion' => array(
            //     'title'       => 'hoopinion',
            //     'website_url' => 'http://www.hoopinionblog.com/',
            //     'feed_url'    => 'http://feeds.feedburner.com/Hoopinion',
            //     'truehoop'    => true,
            // ),
            'peachtree_hoops' => array(
                'title'       => 'Peachtree Hoops',
                'website_url' => 'http://www.peachtreehoops.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/peachtreehoops.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
        ),
        'boston_celtics' => array(
            'celtics_247' => array(
                'title'       => 'Celtics 24/7',
                'website_url' => 'http://www.celtics247.com',
                'feed_url'    => 'http://www.celtics247.com/feed',
            ),
            'celtics_blog' => array(
                'title'       => 'Celtics Blog',
                'website_url' => 'http://www.celticsblog.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/celticsblog?format=xml',
                'sb_nation'   => true,
            ),
            'celtics_blog_boston_com' => array(
                'title'       => 'Celtics Blog, Boston.com',
                'website_url' => 'http://www.boston.com/sports/basketball/celtics/extras/celtics_blog/',
                'feed_url'    => 'http://feeds.boston.com/boston/sports/basketball/celtics/extras/celtics_blog/index',
            ),                        
            'celtics_hub' => array(
                'title'       => 'Celtics Hub',
                'website_url' => 'http://celticshub.com/',
                'feed_url'    => 'http://celticshub.com/feed/',
                'true_hoop'   => true,
            ),
            // 'celtics_stuff_live' => array(
            //     'title'       => 'Celtics Stuff Live',
            //     'website_url' => 'http://celticsstufflive.com',
            //     'feed_url'    => 'http://www.blogtalkradio.com/celtics_stuff_live.rss',
            // ),
            'celtics_town' => array(
                'title'       => 'Celtics Town',
                'website_url' => 'http://celticstown.com',
                'feed_url'    => 'http://www.celticstown.com/feed',
            ),
            // 'green_bandwagon' => array(
            //     'title'       => 'Green Bandwagon',
            //     'website_url' => 'http://www.greenbandwagon.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/celticsblog?format=xml',
            // ),
            'green_room' => array(
                'title'       => 'The Green Room, Celtics fan diaries',
                'website_url' => 'http://www.boston.com/sports/basketball/celtics/extras/green_room/',
                'feed_url'    => 'http://feeds.boston.com/boston/sports/basketball/celtics/extras/green_room/index',
            ),
            'loys_place' => array(
                'title'       => 'Loy&#39;s Place',
                'website_url' => 'http://celticsgreen.blogspot.com',
                'feed_url'    => 'http://feeds.feedburner.com/LoysPlaceACelticsGreenBlog',
            ),
            'reds_army' => array(
                'title'       => 'Red&#39;s Army',
                'website_url' => 'http://www.redsarmy.com',
                'feed_url'    => 'http://feeds.feedburner.com/RedsArmy?format=xml',
            ),
            // 'can_danny' => array(
            //     'title'       => 'Can Danny?',
            //     'website_url' => 'http://www.soulhonky.com/candanny',
            //     'feed_url'    => 'http://www.soulhonky.com/candanny/atom.xml',
            // ),
            // 'shamrock_headband' => array(
            //     'title'       => 'Shamrock Headband',
            //     'website_url' => 'http://shamrockheadband.blogspot.com',
            //     'feed_url'    => 'http://shamrockheadband.blogspot.com/feeds/posts/default',
            // ),                                                
        ),
        'charlotte_bobcats' => array(
            // 'bobcatsden' => array(
            //     'title'       => 'Bobcats Den',
            //     'website_url' => 'http://bobcatsden.com',
            //     'feed_url'    => 'http://bobcatsden.com/feed',
            //     'nbc_sports'  => true,
            // ),
            'bobcats_baseline' => array(
                'title'       => 'Bobcats Baseline',
                'website_url' => 'http://www.bobcatsbaseline.com/blog/bobcats',
                'feed_url'    => 'http://www.bobcatsbaseline.com/blog/bobcats/feed/',
                'nbc_sports'  => true,
            ),
            // 'bobcatsplanet' => array(
            //     'title'       => 'BobcatsPlanet',
            //     'website_url' => 'http://bobcatsplanet.com/wp/',
            //     'feed_url'    => 'http://bobcatsplanet.com/wp/feed',
            // ),
            'bobcatzone' => array(
                'title'       => 'Bobcat Zone',
                'website_url' => 'http://bobcatzone.blogspot.com',
                'feed_url'    => 'http://bobcatzone.blogspot.com/feeds/posts/default',
            ),
            'queen_city_hoops' => array(
                'title'       => 'Queen City Hoops',
                'website_url' => 'http://queencityhoops.com/blog/',
                'feed_url'    => 'http://queencityhoops.com/blog/feed',
                'true_hoop'   => true,
            ),
            'rick_bonnell_inside_the_nba' => array(
                'title'       => 'Rick Bonnell, Inside the NBA',
                'website_url' => 'http://blogs.charlotte.com/inside_the_nba',
                'feed_url'    => 'http://blogs.charlotte.com/inside_the_nba/index.rdf',
            ),
            'rufus_on_fire' => array(
                'title'       => 'Rufus on Fire',
                'website_url' => 'http://www.rufusonfire.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/rufusonfire.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'tradestreetpost' => array(
                'title'       => 'Trade Street Post',
                'website_url' => 'http://tradestreetpost.com',
                'feed_url'    => 'http://www.tradestreetpost.com/rss',
                'bloguin'     => true,
            ),            
        ),
        'chicago_bulls' => array(
            'all_bull' => array(
                'title'       => 'All Bull, Mike McGraw',
                'website_url' => 'http://blogs.dailyherald.com/blog/695',
                'feed_url'    => 'http://blogs.dailyherald.com/blog/695/feed',
            ),
            'blog_a_bull' => array(
                'title'       => 'Blog-A-Bull',
                'website_url' => 'http://blogabull.com',
                'feed_url'    => 'http://blogabull.com/rss/index.rdf',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'bulls_com' => array(
                'title'       => 'Bulls.com Blog',
                'website_url' => 'http://blogs.bulls.com',
                'feed_url'    => 'http://blogs.bulls.com/feed/',
            ),
            'by_the_horns' => array(
                'title'       => 'By The Horns',
                'website_url' => 'http://bullsbythehorns.com',
                'feed_url'    => 'http://bullsbythehorns.com/?feed=rss2',
                'true_hoop'   => true,
            ),
            'chicago_breaking_sports' => array(
                'title'       => 'Chicago Breaking Sports',
                'website_url' => 'http://www.chicagobreakingsports.com/bulls/',
                'feed_url'    => 'http://feeds.feedburner.com/chicagobreakingsports/Vnym?format=xml',
            ),   
            'hornstothehardwood' => array(
                'title'       => 'Horns to Hardwood',
                'website_url' => 'http://hornstothehardwood.com',
                'feed_url'    => 'http://www.hornstothehardwood.com/rss',
                'bloguin'     => true,
            ),
            'inside_the_bulls' => array(
                'title'       => 'Inside the Bulls, Suntimes.com',
                'website_url' => 'http://blogs.suntimes.com/bulls',
                'feed_url'    => 'http://blogs.suntimes.com/bulls/atom.xml',
            ),              
       ),
        'cleveland_cavaliers' => array(
            'and_one' => array(
                'title'       => 'And One',
                'website_url' => 'http://blog.cleveland.com/andone',
                'feed_url'    => 'http://blog.cleveland.com/andone/atom.xml',
            ),
            // 'cavs_news' => array(
            //     'title'       => 'Cavs News',
            //     'website_url' => 'http://www.cavsnews.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/CavsNews?format=xml',
            // ),
            'cavs_the_blog' => array(
                'title'       => 'Cavs: The Blog',
                'website_url' => 'http://www.cavstheblog.com',
                'feed_url'    => 'http://www.cavstheblog.com/?feed=rss2',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),
            'fear_the_sword' => array(
                'title'       => 'Fear the Sword',
                'website_url' => 'http://www.fearthesword.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/fearthesword?format=xml',
                'sb_nation'   => true,
            ),
            'ohio_com' => array(
                'title'       => 'Ohio.com',
                'website_url' => 'http://cavs.ohio.com',
                'feed_url'    => 'http://cavs.ohio.com/feed',
            ),
            'stepien_rules' => array(
                'title'       => 'Stepien Rules',
                'website_url' => 'http://stepienrules.com',
                'feed_url'    => 'http://stepienrules.com/feed/rss.html',
                'bloguin'     => true,
            ),
        ),
        'dallas_mavericks' => array(            
            'dallas_mavericks_report' => array(
                'title'       => 'Dallas Mavericks Report',
                'website_url' => 'http://espn.go.com/blog/dallas/mavericks',
                'feed_url'    => 'http://espn.go.com/blog/feed?blog=dallasmavericks',
            ),
            'dallas_morning_news' => array(
                'title'       => 'Dallas Morning News',
                'website_url' => 'http://mavsblog.dallasnews.com',
                'feed_url'    => 'http://mavsblog.dallasnews.com/index.xml',
            ),
            'mavericks_locker' => array(
                'title'       => 'Mavericks Locker',
                'website_url' => 'http://www.maverickslocker.com',
                'feed_url'    => 'http://www.maverickslocker.com/feed',
            ),
            'mavs_moneyball' => array(
                'title'       => 'Mavs Moneyball',
                'website_url' => 'http://www.mavsmoneyball.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/mavsmoneyball?format=xml',
                'sb_nation'   => true,
            ),
            // Only 2 Posts in RSS feed
            // 'the_smoking_cuban' => array(
            //     'title'       => 'The Smoking Cuban',
            //     'website_url' => 'http://thesmokingcuban.com',
            //     'feed_url'    => 'http://thesmokingcuban.com/feed',
            // ),           
            'the_two_man_game' => array(
                'title'       => 'The Two Man Game',
                'website_url' => 'http://www.thetwomangame.com',
                'feed_url'    => 'http://www.thetwomangame.com/feed/',
                'top_blog'    => true,
                'true_hoop'   => true,  
            ),

        ),
        'denver_nuggets' => array(
            'all_things_nuggets' => array(
                'title'       => 'All Things Nuggets, Denverpost.com',
                'website_url' => 'http://blogs.denverpost.com/nuggets',
                'feed_url'    => 'http://feeds.denverpost.com/dp-sports-nuggets-blog?format=xml',
            ),
            'denver_stiffs' => array(
                'title'       => 'Denver Stiffs',
                'website_url' => 'http://www.denverstiffs.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/denverstiffs?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'nugg_doctor' => array(
                'title'       => 'Nugg Doctor',
                'website_url' => 'http://nuggdoctor.com',
                'feed_url'    => 'http://nuggdoctor.com/feed/rss.html',
                'bloguin'     => true,
            ),
            'nuggets_locker' => array(
                'title'       => 'Nuggets locker',
                'website_url' => 'http://www.nuggetslocker.com',
                'feed_url'    => 'http://www.nuggetslocker.com/feed',
            ),
            // Only 2 Posts in RSS feed
            // 'nugg_love' => array(
            //     'title'       => 'Nugg Love',
            //     'website_url' => 'http://nugglove.com',
            //     'feed_url'    => 'http://nugglove.com/feed',
            //     'yardbarker'   => true,
            // ),
            'pickaxe_and_roll' => array(
                'title'       => 'Pickaxe And Roll',
                'website_url' => 'http://pickaxeandroll.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/denverstiffs?format=xml',
            ),
            'roundball_mining' => array(
                'title'       => 'Roundball Mining Company',
                'website_url' => 'http://www.roundballminingcompany.com',
                'feed_url'    => 'http://www.roundballminingcompany.com/feed',
                'true_hoop'   => true,
            ),
        ),
        'detroit_pistons' => array(
            'detroit_bad_boys' => array(
                'title'       => 'Detroit Bad Boys',
                'website_url' => 'http://www.detroitbadboys.com',
                'feed_url'    => 'http://feeds.feedburner.com/detroitbadboys',
                'sb_nation'   => true,
            ),
            // 'human_victory_cigar' => array(
            //     'title'       => 'Human Victory Cigar',
            //     'website_url' => 'http://www.humanvictorycigar.com',
            //     'feed_url'    => 'http://www.humanvictorycigar.com/feed',
            // ),
            'motown_string_music' => array(
                'title'       => 'Motown String Music',
                'website_url' => 'http://www.motownstringmusic.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/motownstringmusic?format=xml',
                'top_blog'    => true,
            ),
            'need_4_sheed' => array(
                'title'       => 'Need 4 Sheed',
                'website_url' => 'http://www.need4sheed.com',
                'feed_url'    => 'http://feeds.feedburner.com/Need4sheedcomDetroitPistonsRasheedWallaceNewsAndDownloads',
            ),
            // 'pistons_blog' => array(
            //     'title'       => 'Pistons Blog',
            //     'website_url' => 'http://info.detnews.com/redesign/blogs/pistonsblog/index.cfm',
            //     'feed_url'    => 'http://info.detnews.com/redesign/blogs/rss/pistonsblog_rss.xml',
            //     'newspaper'   => 'The Detroit News',
            // ),
            // 'pistons_nation' => array(
            //     'title'       => 'Pistons Nation',
            //     'website_url' => 'http://pistonsnationblog.com',
            //     'feed_url'    => 'http://pistonsnationblog.com/feed',
            // ),
            'piston_powered' => array(
                'title'       => 'Piston Powered',
                'website_url' => 'http://www.pistonpowered.com',
                'feed_url'    => 'http://www.pistonpowered.com/feed',
                'true_hoop'   => true,
            ),
        ),
        'golden_state_warriors' => array(
            'golden_state_of_mind' => array(
                'title'       => 'Golden State of Mind',
                'website_url' => 'http://goldenstateofmind.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/goldenstateofmind.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'inside_the_warriors' => array(
                'title'       => 'Inside The Warriors, Contra Costa Times',
                'website_url' => 'http://www.ibabuzz.com/warriors',
                'feed_url'    => 'http://www.ibabuzz.com/warriors/feed',
            ),
            // 'sfgate' => array(
            //     'title'       => 'Rusty Simmons, SFGate.com',
            //     'website_url' => 'http://www.sfgate.com/cgi-bin/blogs/warriors/index',
            //     'feed_url'    => 'http://feeds.sfgate.com/sfgate/rss/feeds/blogs/sfgate/warriors/index_rss2',
            // ),            
            'talking_points' => array(
                'title'       => 'Talking Points with Tim Kawakami',
                'website_url' => 'http://blogs.mercurynews.com/kawakami',
                'feed_url'    => 'http://blogs.mercurynews.com/kawakami/feed',
            ),
            // 'warriorscourt' => array(
            //     'title'       => 'Warriors Court',
            //     'website_url' => 'http://www.warriorsworld.net',
            //     'feed_url'    => 'http://www.warriorscourt.com/rss',
            //     'bloguin'     => true,
            // ),
            'warriorsworld' => array(
                'title'       => 'WarriorsWorld',
                'website_url' => 'http://www.warriorsworld.net',
                'feed_url'    => 'http://www.warriorsworld.net/feed',
                'true_hoop'   => true,
            ),
        ),
        'houston_rockets' => array(
            'clutch_fans' => array(
                'title'       => 'Clutch Fans',
                'website_url' => 'http://www.clutchfans.com',
                'feed_url'    => 'http://www.clutchfans.com/rss',
            ),                      
            // 'heart_of_a_champion' => array(
            //     'title'       => 'Heart of a Champion',
            //     'website_url' => 'http://heartofchampion.com',
            //     'feed_url'    => 'http://heartofchampion.com/home/?feed=rss2',
            // ),                      
            'houston_chronicle' => array(
                'title'       => 'Jonathan Feigen, Houston Chronicle',
                'website_url' => 'http://blog.chron.com/ultimaterockets/section/jonathan-feigen',
                'feed_url'    => 'http://blog.chron.com/ultimaterockets/feed',
            ),
            'red94' => array(
                'title'       => 'Red94',
                'website_url' => 'http://www.red94.net',
                'feed_url'    => 'http://www.red94.net/?feed=rss2',
                'true_hoop'   => true,
            ),
            'the_dream_shake' => array(
                'title'       => 'The Dream Shake',
                'website_url' => 'http://www.thedreamshake.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/thedreamshake?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
        ),
        'indiana_pacers' => array(
            'eight_points_nine_seconds' => array(
                'title'       => 'Eight Points Nine Seconds',
                'website_url' => 'http://www.eightpointsnineseconds.com',
                'feed_url'    => 'http://feeds.feedburner.com/EightPointsNineSeconds?format=xml',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),
            'indy_cornrows' => array(
                'title'       => 'Indy Cornrows',
                'website_url' => 'http://indycornrows.com',
                'feed_url'    => 'http://indycornrows.com/rss/index.rdf',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'pacers_insider' => array(
                'title'       => 'Pacers Insider',
                'website_url' => 'http://blogs.indystar.com/pacersinsider',
                'feed_url'    => 'http://www.indystar.com/apps/pbcs.dll/section?Category=SPORTS04&template=rss',
            ),
            'pacers_pulse' => array(
                'title'       => 'Pacers Pulse',
                'website_url' => 'http://pacerspulse.com',
                'feed_url'    => 'http://pacerspulse.com/feed/rss.html',
                'bloguin'     => true,
            ),
            
        ),
        'los_angeles_clippers' => array(
            'clipper_blog' => array(
                'title'       => 'ClipperBlog',
                'website_url' => 'http://clipperblog.com',
                'feed_url'    => 'http://clipperblog.com/feed/',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),
            'clippers_locker' => array(
                'title'       => 'Clippers Locker',
                'website_url' => 'http://www.clipperslocker.com',
                'feed_url'    => 'http://www.clipperslocker.com/feed',
            ),
            'clips_nation' => array(
                'title'       => 'Clips Nation',
                'website_url' => 'http://www.clipsnation.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/clipsnation?format=xml',
                'sb_nation'   => true,
            ),
            'inside_the_clippers' => array(
                'title'       => 'Inside the Clippers',
                'website_url' => 'http://insidesocal.com/clippers',
                'feed_url'    => 'http://www.insidesocal.com/clippers/feed',
            ),
            'la_times' => array(
                'title'       => 'LA Times, Clippers',
                'website_url' => 'http://latimesblogs.latimes.com/sports_blog/clippers/index.html',
                'feed_url'    => 'http://feeds.latimes.com/latimes/sports/basketball/nba/clippers?format=xml',
            ),
        ),
        'los_angeles_lakers' => array(
            // 'the_association' => array(
            //     'title'       => 'The Association',
            //     'website_url' => 'http://theassociationblog.com',
            //     'feed_url'    => 'http://theassociation.blogs.com/the_association/index.rdf',
            // ),
            'forum_blue_and_gold' => array(
                'title'       => 'Forum Blue & Gold',
                'website_url' => 'http://forumblueandgold.com',
                'feed_url'    => 'http://www.forumblueandgold.com/feed',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),            
            // 'fuck_yeah_lakers' => array(
            //     'title'       => 'Fuck Yeah Lakers',
            //     'website_url' => 'http://fuckyeahlakers.tumblr.com',
            //     'feed_url'    => 'http://fuckyeahlakers.tumblr.com/rss',
            // ),      
            'kamenetzky_brothers_land_o_lakers' => array(
                'title'       => 'Kamenetzky Brothers Land O&#39; Lakers',
                'website_url' => 'http://espn.go.com/blog/los-angeles/lakers',
                'feed_url'    => 'http://espn.go.com/blog/feed?blog=los-angeleslakers',
                //'has_error'  => true,
            ),
            'inside_the_lakers' => array(
                'title'       => 'Inside the Lakers',
                'website_url' => 'http://www.insidesocal.com/lakers',
                'feed_url'    => 'http://www.insidesocal.com/lakers/atom.xml',
            ),  
            // 'la_balltalk' => array(
            //     'title'       => 'LA Ball Talk',
            //     'website_url' => 'http://www.laballtalk.com',
            //     'feed_url'    => 'http://www.laballtalk.com/feed/',
            // ),  
            'laker_liker' => array(
                'title'       => 'Laker Liker',
                'website_url' => 'http://lakerliker.com',
                'feed_url'    => 'http://lakerliker.com/feeds/posts/default',
            ),
            'lakers_blog_oc_register' => array(
                'title'       => 'Lakers Blog, OC Register',
                'website_url' => 'http://lakers.ocregister.com',
                'feed_url'    => 'http://lakers.ocregister.com/feed/',
            ),                
            'lakers_nation' => array(
                'title'       => 'Lakers Nation',
                'website_url' => 'http://lakernation.com',
                'feed_url'    => 'http://lakernation.com/feed/',
            ),
            // 'lake_show_life' => array(
            //     'title'       => 'Lake Show Life',
            //     'website_url' => 'http://lakeshowlife.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/fansided?format=xml',
            // ),
            'la_lakers_daily_news' => array(
                'title'       => 'LA Lakers Daily News',
                'website_url' => 'http://www.lalakersdailynews.com',
                'feed_url'    => 'http://feeds.feedburner.com/LaLakersNews?format=xml',
            ),
            'la_times' => array(
                'title'       => 'LA Times',
                'website_url' => 'http://lakersblog.latimes.com',
                'feed_url'    => 'http://feeds.latimes.com/latimes/sports/basketball/nba/lakers?format=xml',
                'newspaper'   => 'LA Times',
            ),
            // 'matt_smith' => array(
            //     'title'       => 'Matt "Money" Smith, FOX Sports West',
            //     'website_url' => 'http://www.foxsportswest.com/pages/matt_money',
            //     'feed_url'    => 'http://www.foxsportswest.com/common/dynrss/dynrss_5319_landing_.rss',
            // ),            
            'purple_and_gold_blog' => array(
                'title'       => 'Purple and Gold Blog',
                'website_url' => 'http://purpleandgoldblog.com',
                'feed_url'    => 'http://purpleandgoldblog.com/feed/rss.html',
            ),
            'silver_screen_and_roll' => array(
                'title'       => 'Siver Screen and Roll',
                'website_url' => 'http://www.silverscreenandroll.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/silverscreenandroll?format=xml',
                'sb_nation'   => true,
            ),
            'with_malice' => array(
                'title'       => 'With Malice',
                'website_url' => 'http://with-malice.com',
                'feed_url'    => 'http://with-malice.com/feed/rss.html',
                'bloguin'     => true,
            ),
        ),
        'memphis_grizzlies' => array(
            '3_shades_of_blue' => array(
                'title'       => '3 Shades of Blue',
                'website_url' => 'http://3sob.com',
                'feed_url'    => 'http://3sob.com/index.php?format=feed&type=rss',
                'true_hoop'   => true,
            ),
            'beyond_the_arc' => array(
                'title'       => 'Beyond the Arc',
                'website_url' => 'http://www.memphisflyer.com/blogs/BeyondtheArc',
                'feed_url'    => 'http://www.memphisflyer.com/memphis/Rss.xml?id=rssblog&category=1420774',
            ),
            // 'davids_memphis_grizzlies_blog' => array(
            //     'title'       => 'David&#39;s Memphis Grizzlies Blog',
            //     'website_url' => 'http://davidlovesthegrizzlies.blogspot.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/DavidsMemphisGrizzliesBlog?format=xml',
            // ),
            'straight_outta_vancouver' => array(
                'title'       => 'Straight outta Vancouver',
                'website_url' => 'http://www.straightouttavancouver.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/straightouttavancouver?format=xml',
                'sb_nation'   => true,
            ),
            'the_memphis_edge' => array(
                'title'       => 'The Memphis Edge',
                'website_url' => 'http://blogs.commercialappeal.com/the_memphis_edge/grizzlies-basketball',
                'feed_url'    => 'http://blogs.commercialappeal.com/the_memphis_edge/atom.xml',
            ),            
        ),
        'miami_heat' => array(
            // 'all_u_can_heat' => array(
            //     'title'       => 'All U Can Heat',
            //     'website_url' => 'http://allucanheat.com',
            //     'feed_url'    => 'http://allucanheat.com/feed',
            // ), 
            'heat_locker' => array(
                'title'       => 'Heat Locker',
                'website_url' => 'http://www.heatlocker.com',
                'feed_url'    => 'http://www.heatlocker.com/feed',
            ), 
            'hot_hot_hoops' => array(
                'title'       => 'Hot Hot Hoops',
                'website_url' => 'http://www.hothothoops.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/hothothoops?format=xml',
                'bloguin'     => true,
            ), 
            // 'miami_heat_beat' => array(
            //     'title'       => 'Miami Heat Beat',
            //     'website_url' => 'http://miamiheatbeat.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/MiamiHeatBeat?format=xml',
            // ), 
            'miami_heat_index' => array(
                'title'       => 'Miami Heat Index',
                'website_url' => 'http://miami-heat-index.blogspot.com',
                'feed_url'    => 'http://miami-heat-index.blogspot.com/feeds/posts/default',
            ), 
            'on_the_beat' => array(
                'title'       => 'On The Beat, Miami Heat',
                'website_url' => 'http://blogs.herald.com/miami_heat',
                'feed_url'    => 'http://blogs.herald.com/miami_heat/index.rdf',
            ), 
            'peninsula_is_mightier' => array(
                'title'       => 'Peninsula is Mightier',
                'website_url' => 'http://www.peninsulaismightier.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/peninsulaismightier?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'sun_sentinel' => array(
                'title'       => 'Ira Winderman',
                'website_url' => 'http://blogs.sun-sentinel.com/sports_basketball_heat',
                'feed_url'    => 'http://feeds.feedburner.com/sports/MiamiHeatweblog',
                'author'      => 'Ira Winderman',
                'newspaper'   => 'Sun Sentinel'
            ),
        ),
        'milwaukee_bucks' => array(
            'brew_hoop' => array(
                'title'       => 'Brew Hoop',
                'website_url' => 'http://brewhoop.com',
                'feed_url'    => 'http://brewhoop.com/rss/index.rdf',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'bucksketball' => array(
                'title'       => 'Bucksketball',
                'website_url' => 'http://www.bucksketball.com',
                'feed_url'    => 'http://www.bucksketball.com/feed/',
                'true_hoop'   => true,
            ),                                
            'bucks_blog' => array(
                'title'       => 'Bucks Blog',
                'website_url' => 'http://blogs.jsonline.com/bucks/default.aspx',
                'feed_url'    => 'http://blogs.jsonline.com/bucks/rss.aspx',
            ),               
            // 'courtside_analyst' => array(
            //     'title'       => 'Courtside Analyst',
            //     'website_url' => 'http://courtsideanalyst.wordpress.com',
            //     'feed_url'    => 'http://courtsideanalyst.wordpress.com/feed',
            // ),
            // 'were_bucked' => array(
            //     'title'       => 'Were Bucked',
            //     'website_url' => 'http://werebucked.com',
            //     'feed_url'    => 'http://werebucked.com/feed',
            // ),              
            // 'where_55_happens' => array(
            //     'title'       => 'Where 55 Happens',
            //     'website_url' => 'http://where55happens.wordpress.com',
            //     'feed_url'    => 'http://where55happens.wordpress.com/feed',
            // ),              
        ),
        'minnesota_timberwolves' => array(
            'a_wolf_among_wolves' => array(
                'title'       => 'A Wolf Among Wolves',
                'website_url' => 'http://www.awolfamongwolves.com',
                'feed_url'    => 'http://www.awolfamongwolves.com/?feed=rss2',
                'true_hoop'   => true,
            ),           
            'canis_hoopus' => array(
                'title'       => 'Canis Hoopus',
                'website_url' => 'http://www.canishoopus.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/canishoopus?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),
            'dunking_with_wolves' => array(
                'title'       => 'Dunking With Wolves',
                'website_url' => 'http://dunkingwithwolves.com',
                'feed_url'    => 'http://dunkingwithwolves.com/feed',
            ),      
            // 'howl_at_the_moon' => array(
            //     'title'       => 'Howl at the Moon',
            //     'website_url' => 'http://faither-howlatthemoon.blogspot.com',
            //     'feed_url'    => 'http://faither-howlatthemoon.blogspot.com/feeds/posts/default',
            // ),      
            'howlin_twolf' => array(
                'title'       => 'Howlin T-Wolf',
                'website_url' => 'http://www.howlintwolf.com',
                'feed_url'    => 'http://feeds.feedburner.com/HowlinTWolf?format=xml',
            ),      
            'on_the_wolves' => array(
                'title'       => 'on the Wolves, Jerry Zgoda',
                'website_url' => 'http://www.startribune.com/sports/wolves/blogs/On_the_Wolves.html',
                'feed_url'    => 'http://www.startribune.com/rss/?did=53702862',
            ),        
            // 'timberwolves_den' => array(
            //     'title'       => 'Timberwolves Den',
            //     'website_url' => 'http://mnwolves.blogspot.com',
            //     'feed_url'    => 'http://mnwolves.blogspot.com/feeds/posts/default',
            // ),
            // 'twin_cities' => array(
            //     'title'       => 'TwinCities.com, Pioneer Press',
            //     'website_url' => 'http://blogs.twincities.com/timberwolves',
            //     'feed_url'    => 'http://blogs.twincities.com/timberwolves/atom.xml',
            // ),
            'twolves_blog' => array(
                'title'       => 'Twolves Blog',
                'website_url' => 'http://www.twolvesblog.com',
                'feed_url'    => 'http://www.twolvesblog.com/feed/rss.html',
                'bloguin'     => true,
            ),
        ),
        'brooklyn_nets' => array(
            // 'brooklyn_bound' => array(
            //     'title'       => 'Brooklyn Bound',
            //     'website_url' => 'http://www.brooklyn-bound.com',
            //     'feed_url'    => 'http://www.brooklyn-bound.com/feed/rss.html',
            //     'bloguin'     => true,
            // ),
            // 'in_the_zzone' => array(
            //     'title'       => 'In the &#39;Zzone',
            //     'website_url' => 'http://blogs.northjersey.com/blogs/inthezzone',
            //     'feed_url'    => 'http://blogs.northjersey.com/blogs/inthezzone/rss_2.0',
            // ),      
            'netsareschorching' => array(
                'title'       => 'NetsAreSchorching',
                'website_url' => 'http://netsarescorching.com',
                'feed_url'    => 'http://feeds2.feedburner.com/NetsAreScorching',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),   
            'netblast' => array(
                'title'       => 'NetBlast, Dave D&#39;Allessandro',
                'website_url' => 'http://www.nj.com/newslogs/nets',
                'feed_url'    => 'http://blog.nj.com/netsblast/atom.xml',
            ),      
            'netsdaily' => array(
                'title'       => 'NetsDaily',
                'website_url' => 'http://www.netsdaily.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/netsdaily?format=xml',
                'sb_nation'   => true,
            ),    
            'nets_report' => array(
                'title'       => 'Nets Report, ESPN',
                'website_url' => 'http://espn.go.com/blog/new-york/new-jersey-nets',
                'feed_url'    => 'http://espn.go.com/blog/feed?blog=new-yorknew-jersey-nets',
            ),   
            'nj_com' => array(
                'title'       => 'NJ.com and The Star-Ledger',
                'website_url' => 'http://www.nj.com/nets',
                'feed_url'    => 'http://blog.nj.com/nets_impact/atom.xml',
            ),   
            'ny_post' => array(
                'title'       => 'NY York Post, Fred Kerber',
                'website_url' => 'http://www.nypost.com/blogs/netsblog',
                'feed_url'    => 'http://www.nypost.com/rss/blogs/mobile_netsblog.xml',
            ),                
            'the_internets' => array(
                'title'       => 'The InterNets, Stefan Bondy',
                'website_url' => 'http://www.nydailynews.com/blogs/nets',
                'feed_url'    => 'http://www.nydailynews.com/blogs/nets/rss.xml',
            ),         
        ),
        'new_orleans_hornets' => array(
            'at_the_hive' => array(
                'title'       => 'At The Hive',
                'website_url' => 'http://www.atthehive.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/atthehive?format=xml',
                'sb_nation'   => true,
            ),
            'beeballblog' => array(
                'title'       => 'Bee Ball Blog',
                'website_url' => 'http://www.beeballblog.com',
                'feed_url'    => 'http://www.beeballblog.com/rss',
                'bloguin'   => true,
            ),            
            // 'big_easy_buzz_blog' => array(
            //     'title'       => 'Big Easy Buzz Blog',
            //     'website_url' => 'http://neworleanshornetsblog.blogspot.com',
            //     'feed_url'    => 'http://neworleanshornetsblog.blogspot.com/feeds/posts/default',
            // ),
            'hornets_24-7' => array(
                'title'       => 'Hornets 24-7',
                'website_url' => 'http://hornets247.com',
                'feed_url'    => 'http://feeds.feedburner.com/hornets247-blog?format=xml',
                'true_hoop'   => true,
            ),
            'hornets_locker' => array(
                'title'       => 'Hornets Locker',
                'website_url' => 'http://www.hornetslocker.com',
                'feed_url'    => 'http://www.hornetslocker.com/feed',
            ),          
            'new_orleans_hornets_central' => array(
                'title'       => 'New Orleans Hornets Central',
                'website_url' => 'http://www.nola.com/hornets',
                'feed_url'    => 'http://blog.nola.com/hornets_impact/atom.xml',
            ),        
            'swarm_and_sting' => array(
                'title'       => 'Swarm & Sting',
                'website_url' => 'http://swarmandsting.com',
                'feed_url'    => 'http://swarmandsting.com/feed',
            ),            
        ),
        'new_york_knicks' => array(
            'knickerblogger_net' => array(
                'title'       => 'KnickerBlogger.net',
                'website_url' => 'http://knickerblogger.net',
                'feed_url'    => 'http://www.knickerblogger.net/feed',
            ),
            // 'knicks_clicks' => array(
            //     'title'       => 'Knicks Clicks',
            //     'website_url' => 'http://blog.nj.com/knicks',
            //     'feed_url'    => 'http://blog.nj.com/knicks/atom.xml',
            // ),         
            'knicks_defense' => array(
                'title'       => 'Knicks Defense',
                'website_url' => 'http://www.knicksdefense.com',
                'feed_url'    => 'http://feeds.feedburner.com/knicksdefense?format=xml',
            ),
            'knicks_fanblog' => array(
                'title'       => 'Knicks FanBlog',
                'website_url' => 'http://www.knicksfan.net',
                'feed_url'    => 'http://www.knicksfan.net/?feed=rss2',
            ),
           'knicks_fanatics_blog' => array(
                'title'       => 'Knicks Fanatics Blog',
                'website_url' => 'http://knicksfanaticsblog.com',
                'feed_url'    => 'http://www.knicksfanaticsblog.com/feed/rss.html',
                'bloguin'     => true,
            ),
            'knicks_knation' => array(
                'title'       => 'Knicks Knation, Frank Isola',
                'website_url' => 'http://www.nydailynews.com/blogs/knicks',
                'feed_url'    => 'http://feeds.nydailynews.com/nydnrss/sports/basketball/knicks?format=xml',
            ),    
            'knicks_knightly' => array(
                'title'       => 'Knicks Knightly',
                'website_url' => 'http://www.knicksknightly.com/',
                'feed_url'    => 'http://www.knicksknightly.com/feed/rss',
            ),              
            // 'official_new_york_knicks_tumblr' => array(
            //     'title'       => 'The Official New York Knicks Tumblr',
            //     'website_url' => 'http://newyorkknicks.tumblr.com',
            //     'feed_url'    => 'http://newyorkknicks.tumblr.com/rss',
            // ),      
            'posting_and_toasting' => array(
                'title'       => 'Posting and Toasting',
                'website_url' => 'http://www.postingandtoasting.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/postingandtoasting.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),      

        ),
       'oklahoma_city_thunder' => array(
            // 'bend_it_like_bennett' => array(
            //     'title'       => 'Bend It Like Bennett',
            //     'website_url' => 'http://benditlikebennett.blogspot.com',
            //     'feed_url'    => 'http://benditlikebennett.blogspot.com/feeds/posts/default',
            // ),           
            'daily_thunder' => array(
                'title'       => 'Daily Thunder',
                'website_url' => 'http://www.dailythunder.com',
                'feed_url'    => 'http://www.dailythunder.com/feed',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),     
            // 'oklahoma_city_bbball' => array(
            //     'title'       => 'Oklahoma City BBball',
            //     'website_url' => 'http://www.oklahomacitybball.com',
            //     'feed_url'    => 'http://www.oklahomacitybball.com/feeds/posts/default',
            // ),     
            'thunder_rumblings' => array(
                'title'       => 'Thunder Rumblings',
                'website_url' => 'http://blog.newsok.com/thunderrumblings',
                'feed_url'    => 'http://blog.newsok.com/thunderrumblings/feed',
            ),                  
            
            'welcome_to_loud_city' => array(
                'title'       => 'Welcome To Loud City',
                'website_url' => 'http://www.welcometoloudcity.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/welcometoloudcity?format=xml',
                'sb_nation'   => true,
            ),     
       ),
       'orlando_magic' => array(
           // 'howard_the_dunk' => array(
           //      'title'       => 'Howard The Dunk',
           //      'website_url' => 'http://howardthedunk.com',
           //      'feed_url'    => 'http://howardthedunk.com/feed',
           //  ),              
           'magic_basketball' => array(
                'title'       => 'Magic Basketball',
                'website_url' => 'http://www.magicbasketball.net',
                'feed_url'    => 'http://www.magicbasketball.net/feed/',
                'true_hoop'   => true,
            ),              
           'magic_basket_blog' => array(
                'title'       => 'Magic Basket Blog, Orlando Sentinel',
                'website_url' => 'http://www.orlandosentinel.com/sports/blogs/magic-basketblog',
                'feed_url'    => 'http://www.orlandosentinel.com/sports/blogs/magic-basketblog/rss2.0.xml',
            ),      

           'orlando_magic_daily' => array(
                'title'       => 'Orlando Magic Daily',
                'website_url' => 'http://www.orlandomagicdaily.com',
                'feed_url'    => 'http://www.orlandomagicdaily.com/feed.html',
                'bloguin'     => true,
            ),              
            'orlando_pinstriped_post' => array(
                 'title'       => 'Orlando Pinstriped Post',
                 'website_url' => 'http://www.orlandopinstripedpost.com',
                 'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/orlandopinstripedpost.xml',
                 'top_blog'    => true,
                 'sb_nation'   => true,
             ),              
        ),
        'philadelphia_76ers' => array(
            'deep_sixer' => array(
                'title'       => 'Deep Sixer',
                'website_url' => 'http://www.philly.com/philly/blogs/deep-sixer',
                'feed_url'    => 'http://www.philly.com/deep-sixer.rss',
            ),      
            'depressedfan' => array(
                'title'       => 'Depressed Fan',
                'website_url' => 'http://www.depressedfan.com',
                'feed_url'    => 'http://feeds.feedburner.com/DepressedFan?format=xml',
            ),                 
            'liberty_ballers' => array(
                'title'       => 'Liberty Ballers',
                'website_url' => 'http://www.libertyballers.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/libertyballers?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),          
            'philadunkia' => array(
                'title'       => 'Philadunkia',
                'website_url' => 'http://philadunkia.com',
                'feed_url'    => 'http://philadunkia.com/?feed=rss2',
                'true_hoop'   => true,
            ),   
            // 'sixers_4_guidos' => array(
            //     'title'       => 'Sixers 4 Guidos',
            //     'website_url' => 'http://www.sixers4guidos.com',
            //     'feed_url'    => 'http://www.sixers4guidos.com/feed/rss.html',
            //     'bloguin'     => true,
            // ),   
            // 'sixer_shots' => array(
            //     'title'       => 'Sixer Shots',
            //     'website_url' => 'http://blog.nj.com/sixersshots',
            //     'feed_url'    => 'http://blog.nj.com/sixersshots/atom.xml',
            // ),   
            'sixerville' => array(
                'title'       => 'Sixerville, Bob Cooney',
                'website_url' => 'http://www.philly.com/philly/blogs/sixerville',
                'feed_url'    => 'http://www.philly.com/sixerville.rss',
            ),           
            
                                                                                                                               
        ),
        'phoenix_suns' => array(
            'bright_side_of_the_sun' => array(
                'title'       => 'Bright Side Of The Sun',
                'website_url' => 'http://www.brightsideofthesun.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/brightsideofthesun?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),          
            'coros_orange_slices' => array(
                'title'       => 'Coro\'s Orange Slices',
                'website_url' => 'http://www.azcentral.com/members/Blog/PaulCoro',
                'feed_url'    => 'http://www.azcentral.com/members/Blog~/PaulCoro',
            ),             
            'fanster_deep_purple' => array(
                'title'       => 'Fanster\'s Deep Purple',
                'website_url' => 'http://phoenix.fanster.com/blog/suns',
                'feed_url'    => 'http://feeds.feedburner.com/fanster-suns?format=xml',
            ),      
            'sun_n_gun' => array(
                'title'       => 'Sun-N-Gun',
                'website_url' => 'http://sunngun.com',
                'feed_url'    => 'http://sunngun.com/feed',
            ),              
            'suns_gab' => array(
                'title'       => 'Suns Gab',
                'website_url' => 'http://www.sunsgab.com',
                'feed_url'    => 'http://feeds.feedburner.com/SunsGab?format=xml',
            ),    
            'suns_official' => array(
                'title'       => 'Suns, Official',
                'website_url' => 'http://blog.suns.com',
                'feed_url'    => 'http://blog.suns.com/feed',
            ),             
            'sunsstufft' => array(
                'title'       => 'Suns Stuff\'t',
                'website_url' => 'http://www.sunsstufft.com/',
                'feed_url'    => 'http://www.sunsstufft.com/feed/rss.html',
                'bloguin'     => true,
            ),
            'suns_zoo' => array(
                'title'       => 'Suns Zoo',
                'website_url' => 'http://www.sunszoo.com',
                'feed_url'    => 'http://www.sunszoo.com/feed/rss',
            ),             
              
            // 'the_rising_suns' => array(
            //     'title'       => 'The Rising Suns',
            //     'website_url' => 'http://phoenixsunsrising.blogspot.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/TheRisingSuns',
            // ),   
            'valley_of_the_suns' => array(
                'title'       => 'Valley of the Suns',
                'website_url' => 'http://valleyofthesuns.com',
                'feed_url'    => 'http://feeds.feedburner.com/ValleyoftheSuns?format=xml',
                'true_hoop'   => true,
            ),               

            

       ),
       'portland_trail_blazers' => array(
            'a_stern_warning' => array(
                'title'       => 'A Stern Warning',
                'website_url' => 'http://www.asternwarning.com',
                'feed_url'    => 'http://feeds.feedburner.com/ASternWarning-NBA-NBL?format=xml',
                'bloguin'     => true,
            ),   
            'bLazers_blog' => array(
                'title'       => 'Blazers Blog, Oregon Live',
                'website_url' => 'http://blog.oregonlive.com/blazers/index.html',
                'feed_url'    => 'http://blog.oregonlive.com/blazers/atom.xml',
            ),               
            'bLazers_edge' => array(
                'title'       => 'Blazersedge',
                'website_url' => 'http://www.blazersedge.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/blazersedge.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),          
            'rip_city_project' => array(
                'title'       => 'Rip City Project',
                'website_url' => 'http://ripcityproject.com',
                'feed_url'    => 'http://ripcityproject.com/feed',
            ),              
            'the_portland_roundball_society' => array(
                'title'       => 'The Portland Roundball Society',
                'website_url' => 'http://www.portlandroundballsociety.com',
                'feed_url'    => 'http://www.portlandroundballsociety.com/home/rss.xml',
                'true_hoop'   => true,
            ),          
       ),
       'sacramento_kings' => array(
            'a_royal_pain' => array(
                'title'       => 'A Royal Pain',
                'website_url' => 'http://aroyalpain.com',
                'feed_url'    => 'http://aroyalpain.com/feed',
                'fansided'   => true,
            ),          
            'bleedblackandpurple' => array(
                'title'       => 'Bleed Black and Purple',
                'website_url' => 'http://bleedblackandpurple.blogspot.com',
                'feed_url'    => 'http://bleedblackandpurple.blogspot.com/feeds/posts/default',
                'fansided'   => true,
            ),                      
            'cowbell_kingdom' => array(
                'title'       => 'Cowbell Kingdom',
                'website_url' => 'http://www.cowbellkingdom.com',
                'feed_url'    => 'http://www.cowbellkingdom.com/?feed=rss2',
                'true_hoop'   => true,
            ),          
            // 'full_court_press' => array(
            //     'title'       => 'Full Court Press, Official',
            //     'website_url' => 'http://fullcourtpress.kingsconnect.com',
            //     'feed_url'    => 'http://feeds.feedburner.com/kingsfullcourtpress?format=xml',
            //     'official'    => true,
            // ),                    
            'kings_nba_blog' => array(
                'title'       => 'Kings/NBA Blog, The Sacramento Bee',
                'website_url' => 'http://blogs.sacbee.com/sports/kings/archives/2011/06/how-no-summer-l.html',
                'feed_url'    => 'http://blogs.sacbee.com/sports/kings/atom.xml',
            ),                      
            'sactown_royalty' => array(
                'title'       => 'Sactown Royalty',
                'website_url' => 'http://www.sactownroyalty.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/sactownroyalty.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),  
       ),
       'san_antonio_spurs' => array(
            // 'air_alamo' => array(
            //     'title'       => 'Air Alamo',
            //     'website_url' => 'http://airalamo.com',
            //     'feed_url'    => 'http://airalamo.com/feed',
            //     'fansided'   => true,
            // ),           
            
           '48_minutes_of_hell' => array(
                'title'       => '48 Minutes Of Hell',
                'website_url' => 'http://www.48minutesofhell.com',
                'feed_url'    => 'http://www.48minutesofhell.com/feed',
                'true_hoop'   => true,
            ),           
            'pounding_the_rock' => array(
                'title'       => 'Pounding The Rock',
                'website_url' => 'http://www.poundingtherock.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/poundingtherock.xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),           
            'project_spurs' => array(
                'title'       => 'Project Spurs',
                'website_url' => 'http://www.projectspurs.com',
                'feed_url'    => 'http://feeds.feedburner.com/projectspurs?format=xml',
                'bloguin'     => true,
            ),  
           
            'spurs_dynasty' => array(
                'title'       => 'Spurs Dynasty',
                'website_url' => 'http://www.spursdynasty.com',
                'feed_url'    => 'http://www.spursdynasty.com/feed',
            ),           
            'spurs_nation' => array(
                'title'       => 'Spurs Nation',
                'website_url' => 'http://blog.mysanantonio.com/spursnation',
                'feed_url'    => 'http://blog.mysanantonio.com/spursnation/feed',
            ),              
            // 'spurs_underground' => array(
            //     'title'       => 'Spurs Underground',
            //     'website_url' => 'http://spursunderground.blogspot.com',
            //     'feed_url'    => 'http://spursunderground.blogspot.com/feeds/posts/default',
            // ),  
       ),
       'toronto_raptors' => array(
            // 'from_deep' => array(
            //     'title'       => 'From Deep, Michael Grange',
            //     'website_url' => 'http://www.theglobeandmail.com/sports/basketball/from-deep',
            //     'feed_url'    => 'http://www.theglobeandmail.com/sports/basketball/from-deep/?service=rss',
            // ),            
            'raptors_hq' => array(
                'title'       => 'Raptors HQ',
                'website_url' => 'http://www.raptorshq.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/raptorshq?format=xml',
                'sb_nation'   => true,
            ),  
            'raptors_republic' => array(
                'title'       => 'Raptors Republic',
                'website_url' => 'http://raptorsrepublic.com',
                'feed_url'    => 'http://feeds.feedburner.com/RaptorsRepublic?format=xml',
                'true_hoop'   => true,
            ),     
            // 'the_flagrancy' => array(
            //     'title'       => 'The Flagrancy',
            //     'website_url' => 'http://theflagrancy.typepad.com/the_flagrancy',
            //     'feed_url'    => 'http://theflagrancy.typepad.com/the_flagrancy/index.rdf',
            // ),      
            'toronto_sun' => array(
                'title'       => 'Toronto Sun',
                'website_url' => 'http://www.torontosun.com/sports/basketball',
                'feed_url'    => 'http://www.torontosun.com/sports/basketball/rss.xml',
            ),              
       ),
       'utah_jazz' => array(
            'salt_city_hoops' => array(
                'title'       => 'Salt City Hoops',
                'website_url' => 'http://www.saltcityhoops.com',
                'feed_url'    => 'http://www.saltcityhoops.com/feed',
                'true_hoop'    => true,
            ),     
            'slc_dunk' => array(
                'title'       => 'SLC Dunk',
                'website_url' => 'http://www.slcdunk.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/slcdunk?format=xml',
                'top_blog'    => true,
                'sb_nation'   => true,
            ),     
            'the_utah_jazz_blog' => array(
                'title'       => 'theutahjazzblog',
                'website_url' => 'http://www.theutahjazzblog.com',
                'feed_url'    => 'http://www.theutahjazzblog.com/rss',
                'bloguin'     => true,
            ),   
            'true_blue_jazz' => array(
                'title'       => 'True Blue Jazz',
                'website_url' => 'http://www.truebluejazz.com',
                'feed_url'    => 'http://www.truebluejazz.com/feed/rss.html',
            ),     
            'utah_jazz_360' => array(
                'title'       => 'Utah Jazz 360, Official',
                'website_url' => 'http://www.utahjazz360.com/',
                'feed_url'    => 'http://www.utahjazz360.com/category/jazzbots/feed/atom',
                'official'    => true,
            ), 
            'utah_jazz_notes' => array(
                'title'       => 'Utah Jazz Notes, The Salt Lake Tribune',
                'website_url' => 'http://www.sltrib.com/blogs/jazznotes',
                'feed_url'    => 'http://www.sltrib.com/csp/cms/sites/sltrib/RSS/rss.csp?cat=BlogJazz',
            ),     

       ),
       'washington_wizards' => array(
            'Bullets Forever' => array(
                'title'       => 'Bullets Forever',
                'website_url' => 'http://www.bulletsforever.com',
                'feed_url'    => 'http://feeds.feedburner.com/sportsblogs/bulletsforever?format=xml',
                'sb_nation'   => true,
            ),
            'truth_about_it' => array(
                'title'       => 'Truth About It',
                'website_url' => 'http://www.truthaboutit.net',
                'feed_url'    => 'http://feeds.feedburner.com/TruthAboutIt?format=xml',
                'top_blog'    => true,
                'true_hoop'   => true,
            ),     
            'washington_wizards_blog' => array(
                'title'       => 'Washington Wizards Blog',
                'website_url' => 'http://www.washingtonwizardsblog.com',
                'feed_url'    => 'http://www.washingtonwizardsblog.com/feed',
            ),
            'wizards_insider' => array(
                'title'       => 'Wizards Insider, The Washington Post',
                'website_url' => 'http://www.washingtonpost.com/blogs/wizards-insider',
                'feed_url'    => 'http://feeds.washingtonpost.com/rss/rss_wizards-insider',
            ),
            'wizardsextreme' => array(
                'title'       => 'Wizards Extreme',
                'website_url' => 'http://www.wizardsextreme.com',
                'feed_url'    => 'http://www.wizardsextreme.com/feed/rss.html',
                'bloguin'   => true,
            ),      
            'wiz_of_awes' => array(
                'title'       => 'Wiz of Awes',
                'website_url' => 'http://wizofawes.com',
                'feed_url'    => 'http://wizofawes.com/feed',
                'fansided'   => true,
            ),      
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