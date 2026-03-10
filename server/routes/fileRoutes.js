const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// GET /api/files/download/:filename
router.get('/download/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }

    const ext = path.extname(filename).toLowerCase();
    const viewableExts = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif'];

    if (viewableExts.includes(ext)) {
        res.sendFile(filePath);
    } else {
        res.download(filePath);
    }
});

module.exports = router;
