const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MONGO_URI = process.env.MONGO_URI;

const fixAdmin = async (email) => {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(MONGO_URI);

        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: email.trim() },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount > 0) {
            console.log(`Successfully promoted ${email} to admin!`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

rl.question('Enter the email of the user you want to make an admin: ', (email) => {
    fixAdmin(email);
    rl.close();
});
