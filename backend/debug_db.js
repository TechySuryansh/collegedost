const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User.model');
const Article = require('./src/models/Article.model');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const debugData = async () => {
    await connectDB();

    const articles = await Article.find({});
    console.log(`Found ${articles.length} articles.`);
    if (articles.length > 0) {
        console.log('Sample Article:', JSON.stringify(articles[0], null, 2));
    }

    const users = await User.find({});
    console.log(`Found ${users.length} users.`);
    if (users.length > 0) {
        console.log('Sample User:', JSON.stringify(users[0], null, 2));
    }

    process.exit();
};

debugData();
