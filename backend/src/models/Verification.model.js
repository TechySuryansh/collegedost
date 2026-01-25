const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    type: {
        type: String, // 'email' or 'phone'
        required: true,
        enum: ['email', 'phone']
    },
    value: {
        type: String, // the email or phone number
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 10 * 60 * 1000 // 10 minutes from now
    }
}, {
    timestamps: true
});

// Create a compound index on type and value to ensure uniqueness of verification attempts
verificationSchema.index({ type: 1, value: 1 });

// TTL Index to automatically remove expired documents
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Verification', verificationSchema);
