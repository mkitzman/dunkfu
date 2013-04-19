<?php 
include 'lib/master.inc';         

if(isset($_POST['feedback'])) {

    $to       = 'dunkfudragon@yahoo.com';
    $subject  = 'No Subject Entered.';
    $feedback = 'No Message Entered.';
    $name     = 'No Name given.';
    $email    = 'No Email Entered.';
    
    if($_POST['name'])     { $name     = $_POST['name'];}
    
    if($_POST['email'])    { 
        $email    = $_POST['email'];
        $headers = 'From: contact@dunkfu.com' . "\r\n" . $email . "\r\n";
    } else {
        $headers = 'From: contact@dunkfu.com' . "\r\n";
    }
    
    if($_POST['subject'])  { $subject  = 'CONTACT DUNKFU: ' . $_POST['subject'];}
    if($_POST['feedback']) { $feedback = $_POST['feedback'];}
    
    $feedback .= "\n\From:  $name";
    $feedback .= "\n\nEmail:  $email";
    
    mail($to, $subject, $feedback, $headers);
    
    $email_message = "Awesome, thanks for the feedback!";
} else {
    $email_message = "";
}


$o_DisplayUtil->site_head(array('extra_css' => array('contact.css')));
///////////////////////////////////////////////
	
?>
<section> 
    <div id="contact" class="section">
        <form method="post" url="<?php echo get_url('contact'); ?>">
            <fieldset>   
                <legend>Contact/Feedback</legend>
                <?php 
                    if($email_message) {
                        echo "<h5>$email_message</h5>";
                    } else {
                ?>
                    <p>Do you know of a site or some one we're not following? Feature ideas for the site? Just want to get in touch? You're in the right place.</p>
                    <dl>
                        <dt><label for"name">Name</label></dt>
                        <dd><input type="text" class="input_text" name="name" id="name_id"></dd>
            
                        <dt><label for"email"><span>Email</label></dt>                
                        <dd><input type="text" class="input_text" name="email" id="email"></dd>                          
            
                        <dt><label for"subject">Subject</label></dt>
                        <dd><input type="text" class="input_text" name="subject" id="subject"></dd>
            
                        <dt><label for"feedback">Message</label></dt>                 
                        <dd><textarea class="message" name="feedback" id="feedback"></textarea></dd>                
                
                        <dt>&nbsp;</dt>                 
                        <dd class="cta"><input type="submit" class="button" value="Submit" ></dd>                
                    </dl> 
                
                <?php  } ?>           
            </fieldset>       
        </form>
    </div>    
</section>

<?php

    
///////////////////////////////////////////////
$o_DisplayUtil->site_foot(); 
?>
	