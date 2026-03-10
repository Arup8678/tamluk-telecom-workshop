const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', protect, authorize('Admin', 'Developer -Alpha'), registerUser);
router.post('/login', loginUser);

// User Management Routes (Developer -Alpha only)
router.get('/users', protect, authorize('Developer -Alpha'), getUsers);
router.put('/users/:id', protect, authorize('Developer -Alpha'), updateUser);

module.exports = router;
