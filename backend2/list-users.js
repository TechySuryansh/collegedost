const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/?appName=bhumit";

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();

        console.log('--- ALL USERS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
