const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tamluk_telecom');

        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const pw = await bcrypt.hash('admin123', salt);

        const users = [
            { username: 'admin', password: pw, role: 'Admin' },
            { username: 'inspector', password: pw, role: 'Inspector' },
            { username: 'sric', password: pw, role: 'SRIC' },
            { username: 'sro1', password: pw, role: 'SRO' },
            { username: 'srt1', password: pw, role: 'SRT' },
            { username: 'wireless1', password: pw, role: 'Wireless Operator' },
            { username: 'hgnvf1', password: pw, role: 'HG/NVF' },
            { username: 'rtc1', password: pw, role: 'RTC' },
            { username: 'cv1', password: pw, role: 'CV' },
            { username: 'superior', password: pw, role: 'Superior' },
            { username: 'developer', password: pw, role: 'Developer -Alpha' },
        ];

        await User.insertMany(users);
        console.log('All users seeded! Password: admin123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();
