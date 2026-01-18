import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Remote'
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Full-time',
        validate: {
            isIn: [['Full-time', 'Part-time', 'Contract', 'Internship']]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requirements: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    timestamps: true, // adds createdAt and updatedAt
    updatedAt: false // if you only wanted postedAt (createdAt), but standard timestamps are fine
});

export default Job;
