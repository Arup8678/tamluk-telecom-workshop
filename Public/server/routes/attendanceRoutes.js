const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/authMiddleware');

// Staff roles that give attendance (NOT Inspector/SRIC/Admin)
const STAFF_ROLES = ['SRO', 'SRT', 'Wireless Operator', 'HG/NVF', 'RTC', 'CV'];

// ── CHECK-IN ────────────────────────────────────────────────
router.post('/checkin', protect, async (req, res) => {
    try {
        // Only staff roles can check in
        if (!STAFF_ROLES.includes(req.user.role)) {
            return res.status(403).json({ message: 'Superior officers do not need to check in' });
        }

        const userId = req.user.id;
        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const existing = await Attendance.findOne({ user: userId, date: dateString });
        if (existing) {
            return res.status(400).json({ message: 'Already checked in today', attendance: existing });
        }

        let status = 'On Time';
        if (now.getHours() > 11 || (now.getHours() === 11 && (now.getMinutes() > 0 || now.getSeconds() > 0))) {
            status = 'Late';
        }

        const attendance = await Attendance.create({
            user: userId,
            checkInTime: now,
            status,
            date: dateString
        });

        res.status(201).json({ message: `Checked in — ${status}`, attendance });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: 'Server error during check-in' });
    }
});

// ── CHECK-OUT ───────────────────────────────────────────────
router.post('/checkout', protect, async (req, res) => {
    try {
        if (!STAFF_ROLES.includes(req.user.role)) {
            return res.status(403).json({ message: 'Superior officers do not need to check out' });
        }

        const userId = req.user.id;
        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const attendance = await Attendance.findOne({ user: userId, date: dateString });
        if (!attendance) {
            return res.status(400).json({ message: 'You have not checked in today' });
        }
        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        attendance.checkOutTime = now;
        await attendance.save();

        res.json({ message: 'Checked out successfully', attendance });
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: 'Server error during check-out' });
    }
});

// ── GET TODAY'S ATTENDANCE (Admin/Inspector/SRIC) ───────────
router.get('/today', protect, authorize('Admin', 'Inspector', 'SRIC'), async (req, res) => {
    try {
        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const records = await Attendance.find({ date: dateString })
            .populate('user', 'username role')
            .sort({ checkInTime: -1 });

        res.json(records);
    } catch (error) {
        console.error('Fetch attendance error:', error);
        res.status(500).json({ message: 'Server error fetching attendance' });
    }
});

// ── SEND WARNING TO LATE STAFF (Inspector/SRIC/Admin) ───────
router.put('/warn/:id', protect, authorize('Admin', 'Inspector', 'SRIC'), async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        attendance.warning = req.body.warning || 'You have been warned for late check-in.';
        await attendance.save();

        res.json({ message: 'Warning sent', attendance });
    } catch (error) {
        console.error('Warning error:', error);
        res.status(500).json({ message: 'Server error sending warning' });
    }
});

module.exports = router;
