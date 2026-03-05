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

router.route('/')
    .post(createRequisition) // Public to submit
    .get(protect, getRequisitions);

router.route('/status/:id').get(getRequisitionById);

router.route('/:id')
    .put(protect, authorize('Admin', 'SRIC', 'Inspector'), updateRequisitionStatus)
    .delete(protect, authorize('Admin'), deleteRequisition);

module.exports = router;
