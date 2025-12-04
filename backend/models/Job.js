import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        default: 'Remote'
    },
    type: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    postedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Job', jobSchema);
