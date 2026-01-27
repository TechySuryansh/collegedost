const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const College = require('../src/models/College.model');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost';

async function count() {
    try {
        await mongoose.connect(MONGO_URI);
        const count = await College.countDocuments();
        console.log(`Total Colleges in DB: ${count}`);
        
        if (count > 0) {
            const sample = await College.findOne({});
            console.log('Sample College:', sample.name);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

count();
