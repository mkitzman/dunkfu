<?php 
include 'lib/master.inc';         

if(isset($_GET['url'])) {
    $headers = 'From: dunkfu@dunkfu.com' . "\r\n" . 'Reply-To: dunkfu@dunkfu.com' . "\r\n" . 'X-Mailer: PHP/' . phpversion();
    $message = "REFERER: " . $_GET['url'] . "\n TIME: " . date('D, d M Y H:i:s T', time()) . "\n";
    mail('dunkfudragon@yahoo.com','404',$message, $headers);
}


$o_DisplayUtil->site_head($team, $cat);
///////////////////////////////////////////////
?>
<section> 
    <div id="not_found" class="section">
        <h2>Page not found</h2>
        <p>Sorry, but the page you were looking for can not be found.</p>

        <p>Maybe you were looking for:</p>
        <ul>
            <li><a href="<?php echo WEB_HOME . '/'; ?>">Blogs</a></li>
            <li><a href="<?php echo WEB_HOME . '/twitter'; ?>">Twitter Feeds</a></li>
        </ul>
    </div>
</section>

<?php
///////////////////////////////////////////////
$o_DisplayUtil->site_foot(); 
?>
	