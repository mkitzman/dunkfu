<?php
class DataNbaTeams {
 
 	private $nba_teams = array(
	    'atlanta_hawks' => array(
	            'name'         => 'Atlanta Hawks',
	            'nickname'     => 'Hawks',
	            'city'         => 'Atlanta',
	            'state'        => 'Georgia',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Southeast',
	            'website'      => 'http://nba.com/hawks',
	            'abbreviation' => 'atl',           
	    ),
	    'boston_celtics' => array(
	            'name'         => 'Boston Celtics',
	            'nickname'     => 'Celtics',
	            'city'         => 'Boston',
	            'state'        => 'Massachusetts',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Atlantic',
	            'website'      => 'http://nba.com/celtics',
	            'abbreviation' => 'bos',           
	    ),
        'brooklyn_nets' => array(
                'name'         => 'Brooklyn Nets',
                'nickname'     => 'Nets',
                'city'         => 'Brooklyn, New York City',
                'state'        => 'New York',
                'league'       => 'NBA',
                'conference'   => 'Eastern',
                'division'     => 'Atlantic',
                'website'      => 'http://nba.com/nets',
                'abbreviation' => 'bro',           
        ), 
	    'charlotte_bobcats' => array(
	            'name'         => 'Charlotte Bobcats',
	            'nickname'     => 'Bobcats',
	            'city'         => 'Charlotte',
	            'state'        => 'North Carolina',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Southeast',
	            'website'      => 'http://nba.com/bobcats',
	            'abbreviation' => 'cha',           
	    ),
	    'chicago_bulls' => array(
	            'name'         => 'Chicago Bulls',
	            'nickname'     => 'Bulls',
	            'city'         => 'Chicago',
	            'state'        => 'Illinois',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Central',
	            'website'      => 'http://nba.com/bulls',
	            'abbreviation' => 'chi',           
	    ),
	    'cleveland_cavaliers' => array(
	            'name'         => 'Cleveland Cavaliers',
	            'nickname'     => 'Cavaliers',
	            'city'         => 'Cleveland',
	            'state'        => 'Ohio',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Central',
	            'website'      => 'http://nba.com/cavaliers',
	            'abbreviation' => 'cle',           
	    ),
	    'dallas_mavericks' => array(
	            'name'         => 'Dallas Mavericks',
	            'nickname'     => 'Mavericks',
	            'city'         => 'Dallas',
	            'state'        => 'Texas',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Southwest',
	            'website'      => 'http://nba.com/mavericks',
	            'abbreviation' => 'dal',           
	    ),
	    'denver_nuggets' => array(
	            'name'         => 'Denver Nuggets',
	            'nickname'     => 'Nuggets',
	            'city'         => 'Denver',
	            'state'        => 'Colorado',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Northwest',
	            'website'      => 'http://nba.com/nuggets',
	            'abbreviation' => 'den',           
	    ),
	    'detroit_pistons' => array(
	            'name'         => 'Detroit Pistons',
	            'nickname'     => 'Pistons',
	            'city'         => 'Auburn Hills',
	            'state'        => 'Michigan',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Central',
	            'website'      => 'http://nba.com/pistons',
	            'abbreviation' => 'det',           
	    ),
	    'golden_state_warriors' => array(
	            'name'         => 'Golden State Warriors',
	            'nickname'     => 'Warriors',
	            'city'         => 'Oakland',
	            'state'        => 'California',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Pacific',
	            'website'      => 'http://nba.com/warriors',
	            'abbreviation' => 'gol',           
	    ),
	    'houston_rockets' => array(
	            'name'         => 'Houston Rockets',
	            'nickname'     => 'Rockets',
	            'city'         => 'Houston',
	            'state'        => 'Texas',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Southwest',
	            'website'      => 'http://nba.com/rockets',
	            'abbreviation' => 'hou',           
	    ),  
	    'indiana_pacers' => array(
	            'name'         => 'Indiana Pacers',
	            'nickname'     => 'Pacers',
	            'city'         => 'Indianapolis',
	            'state'        => 'Indiana',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Central',
	            'website'      => 'http://nba.com/pacers',
	            'abbreviation' => 'ind',           
	    ),  
	    'los_angeles_clippers' => array(
	            'name'         => 'Los Angeles Clippers',
	            'nickname'     => 'Clippers',
	            'city'         => 'Los Angeles',
	            'state'        => 'California',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Pacific',
	            'website'      => 'http://nba.com/clippers',
	            'abbreviation' => 'lac',           
	    ),     
	    'los_angeles_lakers' => array(
	            'name'         => 'Los Angeles Lakers',
	            'nickname'     => 'Lakers',
	            'city'         => 'Los Angeles',
	            'state'        => 'California',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Pacific',
	            'website'      => 'http://nba.com/lakers',
	            'abbreviation' => 'lal',           
	  ), 
	    'memphis_grizzlies' => array(
	            'name'         => 'Memphis Grizzlies',
	            'nickname'     => 'Grizzlies',
	            'city'         => 'Memphis',
	            'state'        => 'Tennessee',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Southwest',
	            'website'      => 'http://nba.com/grizzlies',
	            'abbreviation' => 'mem',           
	    ), 
	    'miami_heat' => array(
	            'name'         => 'Miami Heat',
	            'nickname'     => 'Heat',
	            'city'         => 'Miami',
	            'state'        => 'Florida',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Southeast',
	            'website'      => 'http://nba.com/heat',
	            'abbreviation' => 'mia',           
	    ), 
	    'milwaukee_bucks' => array(
	            'name'         => 'Milwaukee Bucks',
	            'nickname'     => 'Bucks',
	            'city'         => 'Milwaukee',
	            'state'        => 'Wisconsin',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Central',
	            'website'      => 'http://nba.com/bucks',
	            'abbreviation' => 'mil',           
	    ), 
	   'minnesota_timberwolves' => array(
	            'name'         => 'Minnesota Timberwolves',
	            'nickname'     => 'Timberwolves',
	            'city'         => 'Minneapolis',
	            'state'        => 'Minnesota',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Northwest',
	            'website'      => 'http://nba.com/timberwolves',
	            'abbreviation' => 'min',           
	    ), 
	    'new_orleans_pelicans' => array(
	            'name'         => 'New Orleans Pelicans',
	            'nickname'     => 'Pelicans',
	            'city'         => 'New Orleans',
	            'state'        => 'Louisiana',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Southwest',
	            'website'      => 'http://nba.com/pelicans',
	            'abbreviation' => 'nop',           
	    ), 
	     'new_york_knicks' => array(
	            'name'         => 'New York Knicks',
	            'nickname'     => 'Knicks',
	            'city'         => 'New York',
	            'state'        => 'New York',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Atlantic',
	            'website'      => 'http://nba.com/knicks',
	            'abbreviation' => 'nyk',           
	    ), 
	    'oklahoma_city_thunder' => array(
	            'name'         => 'Oklahoma City Thunder',
	            'nickname'     => 'Thunder',
	            'city'         => 'Oklahoma City',
	            'state'        => 'Oklahoma',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Northwest',
	            'website'      => 'http://nba.com/thunder',
	            'abbreviation' => 'okc',           
	    ), 
	     'orlando_magic' => array(
	            'name'         => 'Orlando Magic',
	            'nickname'     => 'Magic',
	            'city'         => 'Orlando',
	            'state'        => 'Florida',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Southeast',
	            'website'      => 'http://nba.com/magic',
	            'abbreviation' => 'orl',           
	    ),   
	    'philadelphia_76ers' => array(
	            'name'         => 'Philadelphia 76ers',
	            'nickname'     => '76ers',
	            'city'         => 'Philadelphia',
	            'state'        => 'Pennsylvania',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Atlantic',
	            'website'      => 'http://nba.com/sixers',
	            'abbreviation' => 'phi',           
	    ),   
	    'phoenix_suns' => array(
	            'name'         => 'Phoenix Suns',
	            'nickname'     => 'Suns',
	            'city'         => 'Phoenix',
	            'state'        => 'Arizona',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Pacific',
	            'website'      => 'http://nba.com/suns',
	            'abbreviation' => 'pho',           
	    ),  
	    'portland_trail_blazers' => array(
	            'name'         => 'Portland Trail Blazers',
	            'nickname'     => 'Blazers',
	            'city'         => 'Portland',
	            'state'        => 'Oregon',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Northwest',
	            'website'      => 'http://nba.com/blazers',
	            'abbreviation' => 'por',           
	    ),  
	    'sacramento_kings' => array(
	            'name'         => 'Sacramento Kings',
	            'nickname'     => 'Kings',
	            'city'         => 'Sacramento',
	            'state'        => 'California',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Pacific',
	            'website'      => 'http://nba.com/kings',
	            'abbreviation' => 'sac',           
	    ),  
	    'san_antonio_spurs' => array(
	            'name'         => 'San Antonio Spurs',
	            'nickname'     => 'Spurs',
	            'city'         => 'San Antonio',
	            'state'        => 'Texas',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Southwest',
	            'website'      => 'http://nba.com/spurs',
	            'abbreviation' => 'san',           
	    ),  
	    'toronto_raptors' => array(
	            'name'         => 'Toronto Raptors',
	            'nickname'     => 'Raptors',
	            'city'         => 'Toronto',
	            'state'        => 'Ontario',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Atlantic',
	            'website'      => 'http://nba.com/raptors',
	            'abbreviation' => 'tor',           
	    ),  
	    'utah_jazz' => array(
	            'name'         => 'Utah Jazz',
	            'nickname'     => 'Jazz',
	            'city'         => 'Salt Lake City',
	            'state'        => 'Utah',
	            'league'       => 'NBA',
	            'conference'   => 'Western',
	            'division'     => 'Northwest',
	            'website'      => 'http://nba.com/jazz',
	            'abbreviation' => 'uta',           
	    ),  
	    'washington_wizards' => array(
	            'name'         => 'Washington Wizards',
	            'nickname'     => 'Wizards',
	            'city'         => 'Washington',
	            'state'        => 'D.C.',
	            'league'       => 'NBA',
	            'conference'   => 'Eastern',
	            'division'     => 'Southeast',
	            'website'      => 'http://nba.com/wizards',
	            'abbreviation' => 'was',           
	    ),      
	);


 	private $nba_teams_url_hash = array(
 	    //URL Value     => TEAM ARRAY KEY
	    'hawks'         => 'atlanta_hawks',
	    'celtics'       => 'boston_celtics',
	    'bobcats'       => 'charlotte_bobcats',
	    'bulls'         => 'chicago_bulls',
	    'cavaliers'     => 'cleveland_cavaliers',
	    'mavericks'     => 'dallas_mavericks',
	    'nuggets'       => 'denver_nuggets',
	    'pistons'       => 'detroit_pistons',
	    'warriors'      => 'golden_state_warriors',
	    'rockets'       => 'houston_rockets',
	    'pacers'        => 'indiana_pacers',
	    'clippers'      => 'los_angeles_clippers',
	    'lakers'        => 'los_angeles_lakers',
	    'grizzlies'     => 'memphis_grizzlies',
	    'heat'          => 'miami_heat',
	    'bucks'         => 'milwaukee_bucks',
	    'timberwolves'  => 'minnesota_timberwolves',
	    'nets'          => 'brooklyn_nets',
	    'pelicans'      => 'new_orleans_pelicans',
	    'knicks'        => 'new_york_knicks',
	    'thunder'       => 'oklahoma_city_thunder',
	    'magic'         => 'orlando_magic',
	    '76ers'         => 'philadelphia_76ers',
	    'suns'          => 'phoenix_suns',
	    'blazers'       => 'portland_trail_blazers',
	    'kings'         => 'sacramento_kings',
	    'spurs'         => 'san_antonio_spurs',
	    'raptors'       => 'toronto_raptors',
	    'jazz'          => 'utah_jazz',
	    'wizards'       => 'washington_wizards',
	);
 


	////////////////
	//CODE TO only call one instance of this class
	////////////////
    private static $_instance = null;
 
    private function __construct() {
        // private constructor restricts instantiaton to getInstance()
    }
 
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
 
    public function get() {
		return $this->nba_teams;
    }
    
    public function get_team_key($team) {

        if(isset($this->nba_teams_url_hash[$team])) {
            return $this->nba_teams_url_hash[$team];
        } else {
            return null;
        }
        
    }
 
}


 

?>