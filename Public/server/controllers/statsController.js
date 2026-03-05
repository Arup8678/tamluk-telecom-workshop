const Repair = require('../models/Repair');
const Requisition = require('../models/Requisition');

exports.getDashboardStats = async (req, res) => {
    try {
        const repairs = await Repair.find();
        const requisitions = await Requisition.find();

        const repairStats = {
            total: repairs.length,
            pending: repairs.filter(r => r.status === 'Pending').length,
            approved: repairs.filter(r => r.status === 'Approved').length,
            rejected: repairs.filter(r => r.status === 'Rejected').length,
        };

        const requisitionStats = {
            total: requisitions.length,
            pending: requisitions.filter(r => r.status === 'Pending').length,
            approved: requisitions.filter(r => r.status === 'Approved').length,
            rejected: requisitions.filter(r => r.status === 'Rejected').length,
        };

        res.json({
            repairs: repairStats,
            requisitions: requisitionStats,
            totalRequests: repairStats.total + requisitionStats.total,
            totalPending: repairStats.pending + requisitionStats.pending,
            totalApproved: repairStats.approved + requisitionStats.approved,
            totalRejected: repairStats.rejected + requisitionStats.rejected,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
