import { DataTypes, Sequelize } from 'sequelize';
import path from 'path';

// Local test DB
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:', // Use in-memory DB for testing
    logging: false
});

const Property = sequelize.define('Property', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    region: { type: DataTypes.STRING, allowNull: false },
    propertyType: { type: DataTypes.STRING, allowNull: false },
    transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['Rent', 'Sell', 'Sold']] }
    },
    price: { type: DataTypes.FLOAT, allowNull: false },
    area: { type: DataTypes.FLOAT, allowNull: false },
    bhk: { type: DataTypes.INTEGER, allowNull: false },
    furnishing: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['Furnished', 'Semi-Furnished', 'Unfurnished']] }
    },
    images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    nearbyPlaces: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    address: { type: DataTypes.TEXT, allowNull: false }
});

async function runTest() {
    try {
        await sequelize.sync({ force: true });
        console.log("DB Synced");

        // Simulate payload from frontend
        const data = {
            title: "Test Property in Vaishali",
            description: "A beautiful test property",
            region: "Vaishali",
            propertyType: "Apartment",
            transactionType: "Sell",
            price: 5000000,
            area: 1500,
            bhk: 3,
            furnishing: "Semi-Furnished",
            address: "Vaishali Sector 4, Ghaziabad",
            images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
            nearbyPlaces: {
                metro: 0.5,
                hospital: 1.2,
                school: 0.8,
                market: 2.0
            }
        };

        // Simulate slugify (simplified)
        data.slug = data.title.toLowerCase().replace(/\s+/g, '-');

        console.log("Creating property with raw data (Sequelize handles JSON):");
        const prop = await Property.create(data);
        
        console.log("Created successfully!");
        console.log("Stored images type:", typeof prop.images, prop.images);
        console.log("Stored nearbyPlaces type:", typeof prop.nearbyPlaces, prop.nearbyPlaces);

        // Verification
        if (Array.isArray(prop.images) && prop.images[0] === "https://example.com/img1.jpg") {
            console.log("✅ Images stored correctly as Array");
        } else {
            console.log("❌ Images storage issue");
        }

        if (typeof prop.nearbyPlaces === 'object' && prop.nearbyPlaces.metro === 0.5) {
            console.log("✅ nearbyPlaces stored correctly as Object");
        } else {
            console.log("❌ nearbyPlaces storage issue");
        }

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await sequelize.close();
    }
}

runTest();
