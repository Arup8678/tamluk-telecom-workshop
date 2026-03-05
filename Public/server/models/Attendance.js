const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date, default: null },
    status: { type: String, enum: ['On Time', 'Late'], required: true },
    date: { type: String, required: true },
    warning: { type: String, default: '' }
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
