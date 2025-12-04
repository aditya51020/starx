import mongoose from 'mongoose';
import Property from './models/Property.js';
import { slugify } from './utils/slugify.js';
import 'dotenv/config';

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const title = "Luxury Villa SEO Test";
        const slug = slugify(title);
        console.log('Generated Slug:', slug);

        const data = {
            title,
            slug,
            description: "Test Description",
            region: "Vasundhara",
            address: "101 SEO St",
            propertyType: "Villa",
            transactionType: "Sell",
            bhk: 4,
            area: 2000,
            price: 10000000,
            contactPhone: "9876543210",
            amenities: ["WiFi"],
            images: ["https://placehold.co/600x400"]
        };

        const prop = await Property.create(data);
        console.log('Property Created:', prop.slug);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
};

run();
