const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/authMiddleware');

// File upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// GET /api/notices (Public) - fetch all notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().populate('uploadedBy', 'username role').sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/notices (Protected: Admin, Inspector, SRIC)
router.post('/', protect, authorize('Admin', 'Inspector', 'SRIC'), upload.single('file'), async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const fileUrl = `/uploads/${req.file.filename}`;

        const notice = await Notice.create({
            title,
            fileUrl,
            uploadedBy: req.user.id
        });

        res.status(201).json({ message: 'Notice uploaded successfully', notice });
    } catch (error) {
        console.error('Notice upload error:', error);
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/notices/:id (Protected: Admin, Inspector, SRIC)
router.delete('/:id', protect, authorize('Admin', 'Inspector', 'SRIC'), async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        // Optionally, we could delete the file from the filesystem here using fs.unlink
        await notice.deleteOne();
        res.json({ message: 'Notice removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
