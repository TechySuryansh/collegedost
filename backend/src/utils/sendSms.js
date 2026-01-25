const sendSms = async (options) => {
    // Check if SMS credentials exists, otherwise mock send
    // Assuming environment variables for SMS provider would be here
    if (!process.env.SMS_API_KEY) {
        console.log("---------------------------------------------------");
        console.log("WARNING: SMS credentials not found. Mocking SMS send.");
        console.log(`To: ${options.mobile}`);
        console.log(`Message: ${options.message}`);
        console.log("---------------------------------------------------");

        // Write to file for easier debugging
        const fs = require('fs');
        const path = require('path');
        try {
            fs.writeFileSync(path.join(__dirname, '../../otp-debug-sms.txt'), `To: ${options.mobile}\nMessage: ${options.message}`);
        } catch (e) {
            console.error("Could not write SMS OTP to file", e);
        }
        return;
    }

    // Real implementation would go here (e.g., Twilio, AWS SNS, etc.)
    console.log(`Sending SMS to ${options.mobile}: ${options.message}`);
};

module.exports = sendSms;
