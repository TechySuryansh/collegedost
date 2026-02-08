const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...\n');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@collegedost.com' });

        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
        }

        console.log('Found admin:', admin.email);

        // Update password - this will trigger the pre-save hook to hash it
        admin.password = 'admin123';
        await admin.save();

        console.log('\n✅ Admin password reset successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('  Email: admin@collegedost.com');
        console.log('  Password: admin123');
        console.log('  Role:', admin.role);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
