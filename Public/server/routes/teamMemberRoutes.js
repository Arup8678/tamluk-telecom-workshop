const express = require('express');
const router = express.Router();
const {
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
} = require('../controllers/teamMemberController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTeamMembers) // Public
    .post(protect, authorize('Developer -Alpha'), addTeamMember);

router.route('/:id')
    .put(protect, authorize('Developer -Alpha'), updateTeamMember)
    .delete(protect, authorize('Developer -Alpha'), deleteTeamMember);

module.exports = router;
