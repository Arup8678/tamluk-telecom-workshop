require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const repairRoutes = require('./routes/repairRoutes');
const requisitionRoutes = require('./routes/requisitionRoutes');
const statsRoutes = require('./routes/statsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // Cache control for index.html to ensure fresh frontend code is loaded
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Surrogate-Control', 'no-store');
        } else {
            // Cache static assets forever (Vite uses hashed filenames)
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/files', fileRoutes);

// TEMPORARY SEED ROUTE - remove after first use
app.get('/api/seed', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./models/User');
        const count = await User.countDocuments();
        if (count > 0) return res.json({ message: `Already seeded. ${count} users exist.` });
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
        ];
        await User.insertMany(users);
        res.json({ message: 'Database seeded successfully! 9 users created. Password: admin123' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Developer Alpha specifically
app.get('/api/seed-dev', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./models/User');
        const count = await User.countDocuments();

        const salt = await bcrypt.genSalt(10);
        const pw = await bcrypt.hash('admin123', salt);

        const devUser = await User.findOne({ username: 'developer' });
        if (devUser) {
            devUser.password = pw;
            devUser.role = 'Developer -Alpha';
            await devUser.save();
            return res.json({ message: 'Developer account updated! username: developer, password: admin123' });
        }

        await User.create({ username: 'developer', password: pw, role: 'Developer -Alpha' });
        res.json({ message: 'Developer account created! username: developer, password: admin123' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Catch-all to serve index.html for SPA routes
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        // Prevent caching of index.html here as well
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
    next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tamluk_telecom';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
