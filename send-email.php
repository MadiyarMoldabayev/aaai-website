<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate input
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Email configuration
$fromEmail = 'info@aaai.com';
$toEmails = ['info@aaai.com', 'b.mukina@aaai.com'];
$smtpHost = 'srv-plesk01.ps.kz';
$smtpPort = 587;
$smtpUsername = 'info@aaai.com';
$smtpPassword = 'Astana2025$';

// Email content
$emailSubject = "Contact Form: " . htmlspecialchars($subject);
$emailBody = "You have received a new message from the contact form.\n\n";
$emailBody .= "Name: " . htmlspecialchars($name) . "\n";
$emailBody .= "Email: " . htmlspecialchars($email) . "\n";
$emailBody .= "Subject: " . htmlspecialchars($subject) . "\n\n";
$emailBody .= "Message:\n" . htmlspecialchars($message) . "\n";

// Try to use PHPMailer if available
if (file_exists('vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtpPort;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        
        // Enable verbose debug output (disable in production)
        // $mail->SMTPDebug = 2;
        
        // Recipients
        $mail->setFrom($fromEmail, 'AAAI Contact Form');
        foreach ($toEmails as $toEmail) {
            $mail->addAddress($toEmail);
        }
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
        
        $mail->send();
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo]);
    }
} else {
    // Fallback: Use PHP's mail() function with SMTP configuration via ini_set
    ini_set('SMTP', $smtpHost);
    ini_set('smtp_port', $smtpPort);
    ini_set('sendmail_from', $fromEmail);
    
    $headers = "From: " . $fromEmail . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $success = true;
    foreach ($toEmails as $toEmail) {
        if (!mail($toEmail, $emailSubject, $emailBody, $headers)) {
            $success = false;
        }
    }
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send email. Please ensure PHP mail() is configured correctly.']);
    }
}
?>

