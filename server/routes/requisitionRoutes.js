const express = require('express');
const router = express.Router();
const {
    createRequisition,
    getRequisitions,
    getRequisitionById,
    updateRequisitionStatus,
    deleteRequisition
} = require('../controllers/requisitionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.route('/')
    .post(upload.single('file'), createRequisition) // Public to submit
    .get(protect, getRequisitions);

router.route('/status/:id').get(getRequisitionById);

router.route('/:id')
    .put(protect, authorize('Admin', 'SRIC', 'Inspector', 'Superior', 'Developer -Alpha'), updateRequisitionStatus)
    .delete(protect, authorize('Admin', 'Developer -Alpha'), deleteRequisition);

module.exports = router;
