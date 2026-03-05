const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
    requisitionId: { type: String, unique: true },
    type: { type: String, enum: ['PS', 'Office'], required: true },
    location: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    purpose: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Requisition', requisitionSchema);
