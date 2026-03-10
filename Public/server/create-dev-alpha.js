const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = "mongodb+srv://Arup:Arup%409775630@cluster0.jvlms7h.mongodb.net/tamluk_telecom?retryWrites=true&w=majority";

const createDev = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas!");

        // Check if Developer -Alpha exists
        const existingDev = await User.findOne({ username: 'developer' });
        if (existingDev) {
            console.log("Developer -Alpha 'developer' already exists.");

            // Just update password to admin123 to be safe
            const salt = await bcrypt.genSalt(10);
            existingDev.password = await bcrypt.hash('admin123', salt);
            existingDev.role = 'Developer -Alpha'; // Ensure role is correct
            await existingDev.save();
            console.log("Password reset to 'admin123' and role verified.");

            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const pw = await bcrypt.hash('admin123', salt);

        const newDev = new User({
            username: 'developer',
            password: pw,
            role: 'Developer -Alpha'
        });

        await newDev.save();
        console.log("Successfully created Developer -Alpha account (username: developer, password: admin123)");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE:", err);
        process.exit(1);
    }
};

createDev();
