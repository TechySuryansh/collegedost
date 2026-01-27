const mongoose = require('mongoose');
const College = require('../src/models/College.model');
const NirfRanking = require('../src/models/NirfRanking.model');
require('dotenv').config({ path: '../.env' }); 

const wipe = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
        console.log("Connected to DB.");

        // await College.deleteMany({});
        // console.log("Wiped Colleges.");

        await NirfRanking.deleteMany({});
        console.log("Wiped NIRF Rankings.");

        console.log("Done.");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
};

wipe();
