import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { sendInquiryEmail } from '../utils/emailService.js';

// POST /api/inquiries
export const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, message, propertyId } = req.body;

        // Basic validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const inquiry = await Inquiry.create({
            name,
            email,
            phone,
            message,
            propertyId
        });

        // Send email notification (async, don't block response)
        sendInquiryEmail(inquiry).catch(err => console.error('Email sending failed:', err));

        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
    } catch (error) {
        console.error('Create inquiry error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/admin/inquiries
export const getInquiries = async (req, res) => {
    try {
        // Since we don't have associations set up in models/index.js (standard sequelize pattern)
        // We will fetch properties separately or just return raw ID for now.
        // Or better yet, define association inline here if needed, or simply fetch without join.
        // Let's keep it simple for now and just return the inquiries.

        const inquiries = await Inquiry.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Manual "populate" if needed
        // const propIds = [...new Set(inquiries.map(i => i.propertyId).filter(Boolean))];
        // const props = await Property.findAll({ where: { id: propIds } });
        // const propMap = {};
        // props.forEach(p => propMap[p.id] = p);
        // ... combine ...

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/admin/inquiries/:id
export const deleteInquiry = async (req, res) => {
    try {
        await Inquiry.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/admin/inquiries/:id/status
export const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByPk(req.params.id);
        if (inquiry) {
            await inquiry.update({ status });
        }
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
