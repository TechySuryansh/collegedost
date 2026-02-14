import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    mobile: string;
    password?: string;
    currentClass?: 'Class 12th' | 'Class 11th' | 'Dropper' | 'Graduate' | 'Postgraduate' | 'Other';
    city?: string;
    interest?: string;
    role: 'user' | 'admin';
    googleId?: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    savedColleges: mongoose.Schema.Types.ObjectId[];
    savedArticles: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
    getResetPasswordToken(): string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    currentClass: {
        type: String,
        enum: ['Class 12th', 'Class 11th', 'Dropper', 'Graduate', 'Postgraduate', 'Other'],
    },
    city: String,
    interest: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    googleId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    savedColleges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }],
    savedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function (this: IUser) {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password as string); // Assert string because select: false but if called it should be there or handled
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function (this: IUser) {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
