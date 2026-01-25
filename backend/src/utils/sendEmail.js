const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if SMTP credentials exists, otherwise mock send
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log("---------------------------------------------------");
        console.log("WARNING: SMTP credentials not found. Mocking email send.");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("---------------------------------------------------");

        // Write to file for easier debugging
        const fs = require('fs');
        const path = require('path');
        try {
            fs.writeFileSync(path.join(__dirname, '../../otp-debug.txt'), `To: ${options.email}\nSubject: ${options.subject}\n\n${options.message}`);
        } catch (e) {
            console.error("Could not write OTP to file", e);
        }
        return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME || 'Collegedost'} <${process.env.FROM_EMAIL || 'noreply@collegedost.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        console.error("Error Details:", JSON.stringify(error, null, 2));

        // Log to file
        const fs = require('fs');
        const path = require('path');
        try {
            fs.appendFileSync(path.join(__dirname, '../../email_error.log'), `\n${new Date().toISOString()} - Error: ${error.message}\nStack: ${error.stack}\n`);
        } catch (e) {
            console.error("Could not write error log", e);
        }

        throw error; // Re-throw to be handled by controller
    }
};

module.exports = sendEmail;
