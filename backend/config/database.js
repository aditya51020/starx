import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the SQLite file
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false // Set to console.log to see SQL queries
});

export default sequelize;
