const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        // Parse form data
        const formData = JSON.parse(event.body);
        const { name, subject, message } = formData;

        // Validate input
        if (!name || !subject || !message) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'All fields are required'
                })
            };
        }

        // Email configuration
        const transporter = nodemailer.createTransport({
            host: 'srv-plesk01.ps.kz',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'info@aaai.kz',
                pass: 'Astana2025$'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email content
        const mailOptions = {
            from: 'info@aaai.kz',
            to: 'info@aaai.kz',
            subject: `Contact Form: ${subject}`,
            text: `You have received a new message from the contact form.\n\nName: ${name}\nSubject: ${subject}\n\nMessage:\n${message}\n`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Message sent successfully'
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                message: 'Failed to send email. Please try again later.'
            })
        };
    }
};

