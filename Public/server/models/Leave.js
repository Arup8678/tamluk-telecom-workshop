const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: {
        type: String,
        enum: ['CL', 'EL', 'ML', 'Comp-Off'],
        required: true
    },
    days: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
