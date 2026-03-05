const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/?appName=bhumit";

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const exams = await db.collection('exams').find({}).toArray();

        console.log('--- ALL EXAMS ---');
        exams.forEach(e => {
            console.log(`ID: ${e._id}, Name: ${e.examName}, Slug: ${e.examSlug}, isTop: ${e.isTop}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
