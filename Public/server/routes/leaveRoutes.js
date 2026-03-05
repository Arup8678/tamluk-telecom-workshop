const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Leave = require('../models/Leave');
const { protect, authorize } = require('../middleware/authMiddleware');

// ── File upload config ──────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── APPLY FOR LEAVE ─────────────────────────────────────────
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        const { leaveType, days, reason } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const leave = await Leave.create({
            user: req.user.id,
            leaveType,
            days: Number(days),
            reason,
            fileUrl
        });

        res.status(201).json({ message: 'Leave application submitted', leave });
    } catch (error) {
        console.error('Leave apply error:', error);
        res.status(400).json({ message: error.message });
    }
});

// ── GET MY LEAVES ───────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── GET ALL LEAVES (Admin/Inspector/SRIC) ───────────────────
router.get('/', protect, authorize('Admin', 'Inspector', 'SRIC', 'Superior', 'Developer -Alpha'), async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('user', 'username role')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── APPROVE/REJECT LEAVE (Admin/Inspector/SRIC) ────────────
router.put('/:id', protect, authorize('Admin', 'Inspector', 'SRIC', 'Superior', 'Developer -Alpha'), async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!leave) return res.status(404).json({ message: 'Leave not found' });
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
