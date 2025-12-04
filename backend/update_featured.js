import 'dotenv/config';
import mongoose from 'mongoose';
import Property from './models/Property.js';

async function update() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const prop = await Property.findOne();
        if (prop) {
            prop.featured = true;
            await prop.save();
            console.log('Updated property to featured:', prop._id);
        } else {
            console.log('No properties found');
        }
        process.exit();
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

update();
