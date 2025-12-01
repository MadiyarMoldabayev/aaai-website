<?php
// Start output buffering to prevent any accidental output
ob_start();

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    ob_end_clean();
    http_response_code(200);
    exit;
}

// Set CORS headers for actual requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: false');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
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
    ob_end_clean();
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
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
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
        
        // Recipients
        $mail->setFrom($fromEmail, 'AAAI Contact Form');
        $mail->addAddress($toEmail);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
        
        // Send email
        if (!$mail->send()) {
            throw new Exception('Mail send failed: ' . $mail->ErrorInfo);
        }
        
        ob_end_clean();
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        exit;
        
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        http_response_code(500);
        $errorInfo = $mail->ErrorInfo;
        $exceptionMessage = $e->getMessage();
        
        // Log detailed error for debugging
        error_log('Email send error - ErrorInfo: ' . $errorInfo);
        error_log('Email send error - Exception: ' . $exceptionMessage);
        error_log('Email send error - Name: ' . $name . ', Subject: ' . $subject);
        
        // Return user-friendly error message
        ob_end_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to send email. Please try again later or contact us directly.'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        $exceptionMessage = $e->getMessage();
        
        // Log error
        error_log('Email send error - General Exception: ' . $exceptionMessage);
        
        // Return user-friendly error message
        ob_end_clean();
        echo json_encode([
            'success' => false, 
            'message' => 'An unexpected error occurred. Please try again later.'
        ]);
        exit;
    }
} else {
    // PHPMailer not installed - provide helpful error message
    ob_end_clean();
    http_response_code(500);
    error_log('PHPMailer not found at: ' . $phpmailerPath);
    echo json_encode([
        'success' => false, 
        'message' => 'Email service not configured. Please install PHPMailer by running: composer install'
    ]);
    exit;
}
?>

