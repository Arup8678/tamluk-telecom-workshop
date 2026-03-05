const Repair = require('../models/Repair');

const genRepairId = () => 'REP-' + Date.now().toString().slice(-7) + '-' + Math.floor(Math.random() * 1000);

exports.createRepair = async (req, res) => {
    try {
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const repair = await Repair.create({ ...req.body, repairId: genRepairId(), fileUrl });
        res.status(201).json(repair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRepairs = async (req, res) => {
    try {
        const repairs = await Repair.find().sort({ createdAt: -1 });
        res.json(repairs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRepairById = async (req, res) => {
    try {
        const repair = await Repair.findOne({ repairId: req.params.id });
        if (!repair) {
            return res.status(404).json({ message: 'Repair request not found' });
        }
        res.json(repair);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRepairStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const repair = await Repair.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(repair);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRepair = async (req, res) => {
    try {
        const repair = await Repair.findByIdAndDelete(req.params.id);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json({ message: 'Repair deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
