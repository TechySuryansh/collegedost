const mongoose = require('mongoose');
const NirfRanking = require('../src/models/NirfRanking.model');
require('dotenv').config({ path: '../.env' }); 

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
        console.log("Connected to DB.");

        const count = await NirfRanking.countDocuments();
        console.log(`Total NIRF Rankings: ${count}`);

        const categories = await NirfRanking.distinct('category');
        console.log("Categories present:", categories);

        if (count > 0) {
            const sample = await NirfRanking.findOne().lean();
            console.log("Sample Data:", sample);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
};

check();
