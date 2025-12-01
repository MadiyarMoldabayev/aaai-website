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
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate input
if (empty($name) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Email configuration - static sender and receiver
$fromEmail = 'info@aaai.kz';
$toEmail = 'info@aaai.kz';
$smtpHost = 'srv-plesk01.ps.kz';
$smtpPort = 465;
$smtpUsername = 'info@aaai.kz';
$smtpPassword = 'Astana2025$';

// Email content
$emailSubject = "Contact Form: " . htmlspecialchars($subject);
$emailBody = "You have received a new message from the contact form.\n\n";
$emailBody .= "Name: " . htmlspecialchars($name) . "\n";
$emailBody .= "Subject: " . htmlspecialchars($subject) . "\n\n";
$emailBody .= "Message:\n" . htmlspecialchars($message) . "\n";

// Try to use PHPMailer if available
$phpmailerPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($phpmailerPath)) {
    require_once $phpmailerPath;
    
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        // Port 465 uses SSL/TLS, port 587 uses STARTTLS
        if ($smtpPort == 465) {
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS; // SSL for port 465
        } else {
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS; // STARTTLS for port 587
        }
        $mail->Port = $smtpPort;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        // Enable verbose debug output (disable in production)
        // $mail->SMTPDebug = 2;
        
        // Recipients
        $mail->setFrom($fromEmail, 'AAAI Contact Form');
        $mail->addAddress($toEmail);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
        
        $mail->send();
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        http_response_code(500);
        $errorMessage = 'Failed to send email: ' . $mail->ErrorInfo;
        // Log error for debugging (remove sensitive info in production)
        error_log('Email send error: ' . $errorMessage);
        // Return sanitized error message (don't expose full SMTP details to client)
        echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later or contact us directly.']);
    }
} else {
    // PHPMailer not installed - provide helpful error message
    http_response_code(500);
    error_log('PHPMailer not found at: ' . $phpmailerPath);
    echo json_encode([
        'success' => false, 
        'message' => 'Email service not configured. Please install PHPMailer by running: composer install'
    ]);
}
?>

