import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    try {
        if (!mongoose.connection.db) throw new Error('DB not connected');
        const collections = await mongoose.connection.db.listCollections({ name: 'exams' }).toArray();
        if (collections.length > 0) {
            console.log('Examining indexes for "exams" collection...');
            const indexes = await mongoose.connection.collection('exams').indexes();
            console.log('Current indexes:', indexes.map(idx => idx.name));

            const legacyIndexes = ['examName_1', 'category_1', 'examSlug_1'];
            for (const name of legacyIndexes) {
                if (indexes.some(idx => idx.name === name)) {
                    await mongoose.connection.collection('exams').dropIndex(name);
                    console.log(`✅ Dropped legacy index: ${name}`);
                }
            }
        } else {
            console.log('⏭ Collection "exams" does not exist yet.');
        }
    } catch (error: any) {
        console.error('❌ Error dropping index:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

run();
