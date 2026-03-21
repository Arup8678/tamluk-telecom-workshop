require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const authRoutes = require('./routes/authRoutes');
const repairRoutes = require('./routes/repairRoutes');
const requisitionRoutes = require('./routes/requisitionRoutes');
const statsRoutes = require('./routes/statsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const fileRoutes = require('./routes/fileRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cors());

// ── HEALTH CHECK (for Render keep-alive pings) ────────────────
app.get('/api/version', (req, res) => res.json({ version: '1.0.2-keepalive', status: 'ok' }));

// ── API ROUTES (must be before static middleware) ─────────────
app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/team-members', teamMemberRoutes);

// TEMPORARY SEED ROUTE
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
        res.json({ message: 'Database seeded! 9 users, password: admin123' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/seed-dev', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./models/User');
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

// ── SERVE UPLOADED FILES ──────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── SERVE REACT STATIC BUILD ──────────────────────────────────
const clientDistPath = path.join(__dirname, '../client/dist');
const indexHtmlPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000');
            }
        }
    }));

    // Catch-all: serve index.html for all non-API routes (SPA support)
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return;
        try {
            let html = fs.readFileSync(indexHtmlPath, 'utf8');
            // Inject Google Search Console verification tag
            html = html.replace(
                /<meta name="google-site-verification"[^>]*>/,
                '<meta name="google-site-verification" content="fXhjPASM-QmZ4bVunCnGMwZjQKDS8sgS7m1pS9paMis" />'
            );
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (err) {
            console.error('Error reading index.html:', err.message);
            res.status(500).send('Server error: could not serve frontend.');
        }
    });
} else {
    console.warn('[WARNING] client/dist not found - frontend will not be served.');
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.status(503).json({ message: 'Frontend not built. Run npm run build:client first.' });
        }
    });
}

// ── DATABASE ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tamluk_telecom';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const TeamMember = require('./models/TeamMember');
            const count = await TeamMember.countDocuments();
            if (count === 0) {
                const initialMembers = [
                    { name: 'SRO II Swajan Das', phone: '7699541469', role: 'SRO', order: 1 },
                    { name: 'SRO II SIDDHARTHA SANKAR CHATTOPADHYAY', phone: '9830777902', role: 'SRO', order: 2 },
                    { name: 'SRT I SOMNATH DAS(SRIC)', phone: '95640 52034', role: 'SRT', order: 1 },
                    { name: 'SRT II Sumit Kundu', phone: '9732141601', role: 'SRT', order: 2 },
                    { name: 'SRT II Najrul Islam', phone: '9474040198', role: 'SRT', order: 3 },
                    { name: 'SRT II Anjan Kr. Paul', phone: '6291194939', role: 'SRT', order: 4 },
                    { name: 'SANJOY GHARA', phone: '', role: 'Wireless Operator', order: 1 },
                    { name: 'SANJOY MAHAPATRA', phone: '', role: 'Wireless Operator', order: 2 },
                    { name: 'ARUP GARAI', phone: '', role: 'Wireless Operator', order: 3 },
                    { name: 'SUDIP NAYEK', phone: '', role: 'Wireless Operator', order: 4 },
                    { name: 'BABULAL HEMBRAM', phone: '', role: 'Wireless Operator', order: 5 },
                    { name: 'ARPAN DAS', phone: '', role: 'Wireless Operator', order: 6 },
                    { name: 'SANTANU MAJI', phone: '', role: 'Wireless Operator', order: 7 },
                    { name: 'ASHIS PAIRA', phone: '', role: 'Wireless Operator', order: 8 },
                    { name: 'AVIJIT CHAKRABORTY', phone: '', role: 'Wireless Operator', order: 9 },
                    { name: 'AVIJIT ROY', phone: '', role: 'Wireless Operator', order: 10 },
                    { name: 'SK MUFASSIR ALI PURKAIT', phone: '', role: 'Wireless Operator', order: 11 },
                    { name: 'DEBANU PAL', phone: '', role: 'Wireless Operator', order: 12 },
                    { name: 'MASUD MONDAL', phone: '', role: 'Wireless Operator', order: 13 },
                    { name: 'SUSOVAN BHAKAT', phone: '', role: 'Wireless Operator', order: 14 },
                    { name: 'SUBIR NARAYAN BHATTACHARYA', phone: '', role: 'Wireless Operator', order: 15 },
                    { name: 'TARUN SATPATI', phone: '', role: 'Wireless Operator', order: 16 },
                    { name: 'UTPAL RAJBANSHI', phone: '', role: 'Wireless Operator', order: 17 },
                    { name: 'SUSANTA BASKEY', phone: '', role: 'Wireless Operator', order: 18 },
                    { name: 'SOUROV MONDAL', phone: '', role: 'Wireless Operator', order: 19 },
                    { name: 'ABHIK KUNDU (DEPUTETION AT DIRECTOR SECURITY)', phone: '', role: 'Wireless Operator', order: 20 }
                ];
                await TeamMember.insertMany(initialMembers);
                console.log('Seeded initial team members.');
            }
        } catch (err) {
            console.error('Error seeding team members:', err);
        }
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        // Don't exit — let the app run so health checks still pass
    });

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // ── KEEP-ALIVE SELF-PING (prevents Render free tier sleep) ────
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
    if (RENDER_URL) {
        const pingUrl = `${RENDER_URL}/api/version`;
        const requester = pingUrl.startsWith('https') ? https : http;
        setInterval(() => {
            requester.get(pingUrl, (res) => {
                console.log(`[keep-alive] ping -> ${res.statusCode}`);
            }).on('error', (err) => {
                console.warn('[keep-alive] ping failed:', err.message);
            });
        }, 14 * 60 * 1000);
        console.log(`[keep-alive] Self-ping active -> ${pingUrl}`);
    } else {
        console.log('[keep-alive] No RENDER_EXTERNAL_URL set - local dev mode.');
    }
    // ─────────────────────────────────────────────────────────────
});
