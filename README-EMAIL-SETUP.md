# Email Setup Instructions

## Installation

To enable email functionality, you need to install PHPMailer:

1. Install Composer (if not already installed):
   ```bash
   curl -sS https://getcomposer.org/installer | php
   ```

2. Install PHPMailer:
   ```bash
   composer install
   ```

This will create a `vendor/` directory with PHPMailer.

## Configuration

The email configuration is already set in `send-email.php`:
- **From Email**: info@aaai.com
- **To Emails**: info@aaai.com, b.mukina@aaai.com
- **SMTP Host**: srv-plesk01.ps.kz
- **SMTP Port**: 587
- **SMTP Username**: info@aaai.com
- **SMTP Password**: Astana2025$

## Testing

After installation, test the contact form on your website. The form will send emails to both recipients when submitted.

## Troubleshooting

If emails are not sending:
1. Verify PHPMailer is installed: check that `vendor/autoload.php` exists
2. Check SMTP credentials are correct
3. Ensure port 587 is not blocked by firewall
4. Check server logs for errors

