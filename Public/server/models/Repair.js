const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    repairId: { type: String, unique: true },
    type: { type: String, enum: ['PS', 'Office'], required: true },
    location: { type: String, required: true },
    issue: { type: String, required: true },
    contact: { type: String, required: true },
    fileUrl: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Repair', repairSchema);
