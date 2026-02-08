const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@collegedost.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            console.log('Email:', adminExists.email);
            console.log('Role:', adminExists.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@collegedost.com',
            mobile: '+911234567890',
            password: 'admin123',  // Change this password!
            role: 'admin',
            isVerified: true,
            currentClass: 'Class 12th',
            city: 'Delhi'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('Role:', admin.role);
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdminUser();
