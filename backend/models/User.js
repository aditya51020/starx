import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
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
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wishlist: {
        type: DataTypes.TEXT, // Storing as JSON string for SQLite simplicity
        defaultValue: '[]',
        get() {
            const rawValue = this.getDataValue('wishlist');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('wishlist', JSON.stringify(value));
        }
    }
}, {
    timestamps: true
});

export default User;
