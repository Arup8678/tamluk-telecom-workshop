const Requisition = require('../models/Requisition');

const genReqId = () => 'REQ-' + Date.now().toString().slice(-7) + '-' + Math.floor(Math.random() * 1000);

exports.createRequisition = async (req, res) => {
    try {
        const requisition = await Requisition.create({ ...req.body, requisitionId: genReqId() });
        res.status(201).json(requisition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRequisitions = async (req, res) => {
    try {
        const requisitions = await Requisition.find().sort({ createdAt: -1 });
        res.json(requisitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRequisitionById = async (req, res) => {
    try {
        const requisition = await Requisition.findOne({ requisitionId: req.params.id });
        if (!requisition) {
            return res.status(404).json({ message: 'Requisition not found' });
        }
        res.json(requisition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRequisitionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const requisition = await Requisition.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!requisition) {
            return res.status(404).json({ message: 'Requisition not found' });
        }
        res.json(requisition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRequisition = async (req, res) => {
    try {
        const requisition = await Requisition.findByIdAndDelete(req.params.id);
        if (!requisition) {
            return res.status(404).json({ message: 'Requisition not found' });
        }
        res.json({ message: 'Requisition deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
