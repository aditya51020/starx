import Job from '../models/Job.js';

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 });
        res.json({ success: true, data: jobs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create a new job
export const createJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
