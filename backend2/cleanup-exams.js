const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/?appName=bhumit";

async function cleanup() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const result = await db.collection('exams').deleteMany({
            $or: [
                { examName: { $exists: false } },
                { examName: null },
                { examName: "undefined" }
            ]
        });

        console.log(`Successfully deleted ${result.deletedCount} phantom exam records.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanup();
