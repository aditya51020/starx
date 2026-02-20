import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metaDescription: {
    type: DataTypes.STRING
  },
  keywords: {
    type: DataTypes.JSON, // Storing array as JSON string
    defaultValue: []
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  propertyType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Rent', 'Sell', 'Sold']]
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  bhk: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER
  },
  totalFloors: {
    type: DataTypes.INTEGER
  },
  furnishing: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Furnished', 'Semi-Furnished', 'Unfurnished']]
    }
  },
  amenities: {
    type: DataTypes.JSON, // Storing array as JSON string
    defaultValue: []
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lat: {
    type: DataTypes.FLOAT
  },
  lng: {
    type: DataTypes.FLOAT
  },
  images: {
    type: DataTypes.JSON, // Storing array as JSON string
    allowNull: false,
    defaultValue: []
  },
  nearbyPlaces: {
    type: DataTypes.JSON, // { metro: 2.5, hospital: 1.0, school: 3.5, market: 0.5 }
    defaultValue: {}
  },
  contactName: {
    type: DataTypes.STRING
  },
  contactPhone: {
    type: DataTypes.STRING
  },
  contactEmail: {
    type: DataTypes.STRING
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
    validate: {
      isIn: [['Active', 'Inactive']]
    }
  }
}, {
  timestamps: true
});

export default Property;