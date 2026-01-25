const mongoose = require('mongoose');
const User = require('./src/models/User.model');
const dotenv = require('dotenv');
dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Check loosely to account for typos
        const email = "sonibhumit196@gmail.com";
        // Note: User put "sonibhumit196@gmail" in prompt, I assume .com

        const user = await User.findOne({ email: new RegExp(email, 'i') });
        console.log(`Checking for user: ${email}`);

        if (user) {
            console.log("User FOUND:", user.email);
            console.log("User Data:", { name: user.name, mobile: user.mobile });
        } else {
            console.log("User NOT FOUND");
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkUser();
