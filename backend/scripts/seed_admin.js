import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';
import sequelize from './config/database.js';

const seedAdmin = async () => {
    try {
        await sequelize.sync();
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
            email: 'admin@starx.com',
            password: hashedPassword
        });
        console.log('Admin user created');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();
