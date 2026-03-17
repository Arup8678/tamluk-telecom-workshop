const mongoose = require('mongoose');

const checkContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false, // In case someone doesn't have a phone number listed
        default: ''
    },
    role: {
        type: String,
        required: true,
        enum: ['SRO', 'SRT', 'Wireless Operator', 'HG/NVF', 'RTC', 'CV', 'Other'] // Enum based on roles from Home.jsx
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', checkContactSchema);
