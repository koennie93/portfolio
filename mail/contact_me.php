<?php
// Debug mode - uncomment to see errors and request data
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Store form data
$post_data = $_POST;
$has_error = false;
$error_message = '';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    $has_error = true;
    $error_message = "Error: Request method is not POST. Current method: " . $_SERVER["REQUEST_METHOD"];
}

// Check if email exists and is valid
$email_address = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : false;

// Check for empty fields
if(empty($_POST['name']) || 
   empty($_POST['email']) || 
   empty($_POST['phone']) || 
   empty($_POST['message']) ||
   !$email_address)
{
    $has_error = true;
    $error_message = "Error: Required fields are missing or email is invalid.";
}

// Process if no errors
if (!$has_error) {
    $name = strip_tags(htmlspecialchars($_POST['name']));
    $phone = strip_tags(htmlspecialchars($_POST['phone']));
    $message = strip_tags(htmlspecialchars($_POST['message']));
    
    if (empty($_POST['_gotcha'])) { // Anti-spam check
        // Email details
        $to = 'koenvanrijn@gmail.com';
        $email_subject = "Portfolio Contact Form:  $name";
        $email_body = "You have received a new message from your portfolio website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
        $headers = "From: noreply@koenvanrijn.com\n";
        $headers .= "Reply-To: $email_address";
        
        // Send email
        if (mail($to, $email_subject, $email_body, $headers)) {
            // Redirect back with success
            header('Location: ' . $_SERVER['HTTP_REFERER'] . '?message=success');
        } else {
            // Redirect back with error
            header('Location: ' . $_SERVER['HTTP_REFERER'] . '?message=error');
        }
    } else {
        // Honeypot caught a spam bot
        header('Location: ' . $_SERVER['HTTP_REFERER'] . '?message=spam');
    }
} else {
    // Redirect back with validation error
    header('Location: ' . $_SERVER['HTTP_REFERER'] . '?message=validation&error=' . urlencode($error_message));
}
?> 