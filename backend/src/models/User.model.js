const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true // Allow unique but ignore nulls if user signs up via mobile only initially
  },
  mobile: {
    type: String,
    required: [function () { return !this.googleId; }, 'Please add a mobile number'],
    unique: true,
    sparse: true
  },
  currentClass: {
    type: String // 'Class 12th', 'Class 11th', etc.
  },
  interest: {
    type: String // 'B.E/B.Tech', etc.
  },
  city: {
    type: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: [function () { return !this.googleId; }, 'Please add a password'],
    select: false
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password using bcrypt
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token (6 digit OTP)
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
