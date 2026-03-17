const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find({}).sort({ role: 1, order: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching team members' });
    }
};

// @desc    Add a team member
// @route   POST /api/team-members
// @access  Private (Developer -Alpha)
const addTeamMember = async (req, res) => {
    try {
        const { name, phone, role, order } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and role are required' });
        }
        const member = await TeamMember.create({ name, phone, role, order: order || 0 });
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating team member' });
    }
};

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private (Developer -Alpha)
const updateTeamMember = async (req, res) => {
    try {
        const { name, phone, role, order } = req.body;
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        if (name) member.name = name;
        if (phone !== undefined) member.phone = phone;
        if (role) member.role = role;
        if (order !== undefined) member.order = order;
        
        await member.save();
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating team member' });
    }
};

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private (Developer -Alpha)
const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        await member.deleteOne();
        res.json({ message: 'Team member deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting team member' });
    }
};

module.exports = {
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
};
