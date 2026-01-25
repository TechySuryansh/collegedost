const Verification = require('../models/Verification.model');
const User = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate numeric OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP for verification (Email or Phone)
// @route   POST /api/verification/send-otp
// @access  Public
exports.sendOtp = async (req, res) => {
    try {
        const { type, value } = req.body;

        if (!type || !value) {
            return res.status(400).json({ success: false, message: 'Please provide type and value' });
        }

        if (!['email', 'phone'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }

        // 1. Check if User already exists
        let userExists;
        if (type === 'email') {
            userExists = await User.findOne({ email: value });
        } else {
            userExists = await User.findOne({ mobile: value });
        }

        if (userExists) {
            return res.status(400).json({ success: false, message: `User with this ${type} already exists` });
        }

        // 2. Generate OTP
        const otp = generateOTP();

        // 3. Store OTP (Use upsert to replace existing OTP for this value)
        // In production, we might want to rate limit here (e.g. check createdBy of existing doc)

        await Verification.findOneAndUpdate(
            { type, value },
            {
                type,
                value,
                otp: otp, // Storing plain for simplicity, consistent with robust expiry. In high security, hash this.
                expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
            },
            { upsert: true, new: true }
        );

        // 4. Send OTP
        if (type === 'email') {
            const message = `Your verification code is: ${otp}`;
            try {
                await sendEmail({
                    email: value,
                    subject: 'Account Verification Code',
                    message,
                    html: `<div style="font-family: sans-serif; padding: 20px;">
                            <h2>Verification Code</h2>
                            <p>Your code is: <strong>${otp}</strong></p>
                            <p>This code expires in 10 minutes.</p>
                           </div>`
                });
            } catch (err) {
                console.error("Email send failed:", err);
                return res.status(500).json({ success: false, message: "Failed to send email OTP" });
            }
        } else if (type === 'phone') {
            // Simulate SMS
            console.log(`==========================================`);
            console.log(`[SMS MOCK] OTP for ${value}: ${otp}`);
            console.log(`==========================================`);
            // In production: await sendSms(value, otp);
        }

        res.status(200).json({ success: true, message: `${type} OTP sent successfully` });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/verification/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
    try {
        const { type, value, otp } = req.body;

        if (!type || !value || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide all details' });
        }

        // 1. Find Verification Record
        const record = await Verification.findOne({ type, value });

        if (!record) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // 2. Check Expiry (redundant if mongo TTL works, but safe)
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // 3. Verify OTP
        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // 4. Generate Verification Token
        // This token proves that this specific value was verified
        const verificationToken = jwt.sign(
            { target: value, type, verified: true },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        // 5. Cleanup (Optional: delete the verification record to prevent reuse)
        await Verification.deleteOne({ _id: record._id });

        res.status(200).json({
            success: true,
            message: `${type} verified successfully`,
            verificationToken
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
