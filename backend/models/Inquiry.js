import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Inquiry = sequelize.define('Inquiry', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: true // Optional
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'New',
        validate: {
            isIn: [['New', 'Contacted', 'Closed']]
        }
    }
}, {
    timestamps: true // This adds createdAt and updatedAt
});

export default Inquiry;
