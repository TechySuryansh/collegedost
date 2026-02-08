const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...\n');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@collegedost.com' });

        if (admin) {
            console.log('✅ Admin user found:');
            console.log('  Name:', admin.name);
            console.log('  Email:', admin.email);
            console.log('  Mobile:', admin.mobile);
            console.log('  Role:', admin.role);
            console.log('  Created:', admin.createdAt);
            console.log('\n📝 Login Credentials:');
            console.log('  Email: admin@collegedost.com');
            console.log('  Password: admin123');
        } else {
            console.log('❌ No admin user found');
            console.log('Creating admin user...');

            const newAdmin = await User.create({
                name: 'Admin',
                email: 'admin@collegedost.com',
                mobile: '+911234567890',
                password: 'admin123',
                role: 'admin',
                isVerified: true
            });

            console.log('✅ Admin created!');
            console.log('  Email: admin@collegedost.com');
            console.log('  Password: admin123');
        }

        // List all users
        const allUsers = await User.find().select('-password');
        console.log('\n📊 Total users in database:', allUsers.length);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkUser();
