const express = require('express');
const router = express.Router();
const {
    createRepair,
    getRepairs,
    getRepairById,
    updateRepairStatus,
    deleteRepair
} = require('../controllers/repairController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(createRepair) // Public route for submission
    .get(protect, getRepairs); // Admin/SRIC/Inspector

router.route('/status/:id').get(getRepairById); // Public status check

router.route('/:id')
    .put(protect, authorize('Admin', 'SRIC', 'Inspector'), updateRepairStatus)
    .delete(protect, authorize('Admin'), deleteRepair);

module.exports = router;
