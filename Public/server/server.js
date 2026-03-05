require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const repairRoutes = require('./routes/repairRoutes');
const requisitionRoutes = require('./routes/requisitionRoutes');
const statsRoutes = require('./routes/statsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

// Catch-all to serve index.html for SPA routes
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
    next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tamluk_telecom';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
