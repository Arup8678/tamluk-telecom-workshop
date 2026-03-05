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
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.route('/')
    .post(upload.single('file'), createRepair) // Public route for submission
    .get(protect, getRepairs); // Admin/SRIC/Inspector

router.route('/status/:id').get(getRepairById); // Public status check

router.route('/:id')
    .put(protect, authorize('Admin', 'SRIC', 'Inspector'), updateRepairStatus)
    .delete(protect, authorize('Admin'), deleteRepair);

module.exports = router;
