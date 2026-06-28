import Property from '../models/Property.js';
import { slugify } from '../utils/slugify.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Allowed regions — keep in sync with frontend config/regions.js
const ALLOWED_REGIONS = [
  'Nyay Khand', 'Ahinsa Khand', 'Vaibhav Khand', 'Shipra Suncity',
  'Vasundhara', 'Indirapuram', 'Vaishali', 'Sector 63',
  'Noida Extension', 'Sahibabad', 'Siddharth Vihar',
  'Crossings Republik', 'Raj Nagar Extension', 'Govindpuram', 'Other'
];

/**
 * Normalize a region string:
 * 1. Trim whitespace
 * 2. Case-insensitive match against ALLOWED_REGIONS
 * 3. Return the canonical spelling, or the trimmed input if no match
 */
const normalizeRegion = (region) => {
  if (!region) return region;
  const trimmed = region.trim();
  const match = ALLOWED_REGIONS.find(
    r => r.toLowerCase() === trimmed.toLowerCase()
  );
  return match || trimmed;
};

// GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const { region, transactionType, propertyType, minPrice, maxPrice, bhk, featured, amenities, search, limit = 20, page = 1 } = req.query;
    
    // Check if requester is admin
    let isAdmin = false;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') {
          isAdmin = true;
        }
      } catch (err) {
        // Ignore invalid token, treat as public
      }
    }

    const where = {};
    if (!isAdmin) {
      where.status = 'Active';
    } else if (req.query.status && req.query.status !== 'all') {
      where.status = req.query.status;
    }

    if (region) {
      const regions = region.split(',').map(r => r.trim()).filter(Boolean);
      if (regions.length > 1) {
        where[Op.or] = [
          ...(where[Op.or] || []),
          ...regions.map(r => ({ region: { [Op.like]: `%${r}%` } }))
        ];
      } else {
        where.region = { [Op.like]: `%${regions[0]}%` };
      }
    }
    if (transactionType) where.transactionType = transactionType;
    if (propertyType) where.propertyType = propertyType;
    if (bhk) where.bhk = +bhk;
    if (featured === 'true') where.featured = true;

    // Price Filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = +minPrice;
      if (maxPrice) where.price[Op.lte] = +maxPrice;
    }

    // Search Filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    // Amenities Filter (JSON array check)
    // Note: SQLite JSON support is specific. For simple array containment we might need raw queries or simplified check
    // Since we are storing as JSON string/array, we can use direct string matching if guaranteed order or use specialized operators
    // For now, simpler implementation: fetch and filter in JS if complex, but here simplistic:
    // If amenities stored as literal JSON string array `["Gym","Pool"]`, `LIKE` might work crudely or proper JSON ops
    // Let's rely on standard JSON contains if supported or use Op.like for simple string match as a fallback for SQLite
    if (amenities) {
      const amenitiesList = amenities.split(',');
      // This is a naive implementation for SQLite JSON text.
      // Ideally: where: sequelize.where(sequelize.fn('json_extract', sequelize.col('amenities'), '$'), ...)
      // For broad compatibility in this simple app, we can iterate or use multiple LIKEs
      // where [Op.and] = amenitiesList.map(a => ({ amenities: { [Op.like]: `%"${a}"%` } }));
      where[Op.and] = amenitiesList.map(a => ({ amenities: { [Op.like]: `%"${a}"%` } }));
    }

    if (req.query.ids) {
      const ids = req.query.ids.split(',');
      if (ids.length > 0) where.id = { [Op.in]: ids };
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Property.findAndCountAll({
      where,
      limit: +limit,
      offset: +offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      total: count,
      page: +page,
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get Properties Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const p = await Property.findByPk(req.params.id);
    if (!p) {
      // Fallback: try by slug if ID is not numeric or not found
      const bySlug = await Property.findOne({ where: { slug: req.params.id } });
      if (bySlug) return res.json(bySlug);
      return res.status(404).json({ msg: 'Not found' });
    }
    res.json(p);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// POST /api/admin/properties
export const createProperty = async (req, res) => {
  try {
    const data = req.body;
    console.log("Creating Property with data:", JSON.stringify(data, null, 2));

    // Generate slug from title and region
    if (data.title) {
      let baseSlug = slugify(data.title);
      let slug = baseSlug;
      if (data.region) {
        slug = `${baseSlug}-${slugify(data.region)}`;
      }
      // Check for duplicate slug
      let existing = await Property.findOne({ where: { slug } });
      if (existing) {
        // If still collides, append a short random string
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${randomSuffix}`;
      }
      data.slug = slug;
    }

    /* 
    // Redundant for Sequelize 6+ with SQLite and DataTypes.JSON
    if (data.images && typeof data.images !== 'string') data.images = JSON.stringify(data.images);
    if (data.amenities && typeof data.amenities !== 'string') data.amenities = JSON.stringify(data.amenities);
    if (data.nearbyPlaces && typeof data.nearbyPlaces !== 'string') data.nearbyPlaces = JSON.stringify(data.nearbyPlaces);
    if (data.keywords && typeof data.keywords !== 'string') data.keywords = JSON.stringify(data.keywords);
    */

    // Normalize region to canonical spelling
    if (data.region) data.region = normalizeRegion(data.region);

    const prop = await Property.create(data);
    res.status(201).json(prop);
  } catch (error) {
    console.error("Create Property Error:", error);
    // Log detailed error for debugging
    if (error.errors) {
      console.error("Validation Details:", JSON.stringify(error.errors, null, 2));
    }

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
};

// PUT /api/admin/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const data = req.body;
    const prop = await Property.findByPk(req.params.id);

    if (!prop) return res.status(404).json({ message: 'Property not found' });

    // Update slug if title or region changes
    if (data.title && (data.title !== prop.title || (data.region && data.region !== prop.region))) {
      let baseSlug = slugify(data.title);
      let slug = baseSlug;
      const targetRegion = data.region || prop.region;
      if (targetRegion) {
        slug = `${baseSlug}-${slugify(targetRegion)}`;
      }
      // Ensure unique slug (excluding current doc)
      let existing = await Property.findOne({
        where: {
          slug,
          id: { [Op.ne]: req.params.id }
        }
      });
      if (existing) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${randomSuffix}`;
      }
      data.slug = slug;
    }

    /*
    // Redundant for Sequelize 6+ with SQLite and DataTypes.JSON
    if (data.images && typeof data.images !== 'string') data.images = JSON.stringify(data.images);
    if (data.amenities && typeof data.amenities !== 'string') data.amenities = JSON.stringify(data.amenities);
    if (data.nearbyPlaces && typeof data.nearbyPlaces !== 'string') data.nearbyPlaces = JSON.stringify(data.nearbyPlaces);
    if (data.keywords && typeof data.keywords !== 'string') data.keywords = JSON.stringify(data.keywords);
    */

    // Normalize region to canonical spelling
    if (data.region) data.region = normalizeRegion(data.region);

    console.log('Update Property Body:', JSON.stringify(data, null, 2));

    // Check if nearbyPlaces is being passed
    if (data.nearbyPlaces) {
      console.log('Updating nearbyPlaces:', data.nearbyPlaces);
    }

    await prop.update(data);

    // Refetch to see what's in DB
    await prop.reload();
    console.log('Updated Property loaded from DB:', JSON.stringify(prop.nearbyPlaces, null, 2));

    res.json(prop);
  } catch (error) {
    console.error("Update Property Error:", error);
    if (error.errors) {
      console.error("Update Validation Details:", JSON.stringify(error.errors, null, 2));
    }

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: 'Update Failed', errors: messages });
    }
    res.status(400).json({ message: 'Update Failed', error: error.message });
  }
};

// DELETE /api/admin/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const count = await Property.destroy({ where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete Failed', error: error.message });
  }
};

// DELETE /api/admin/properties/bulk
export const bulkDelete = async (req, res) => {
  try {
    await Property.destroy({
      where: {
        id: { [Op.in]: req.body.ids }
      }
    });
    res.json({ msg: 'Bulk deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Bulk Delete Failed', error: error.message });
  }
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const total = await Property.count();
    const rent = await Property.count({ where: { transactionType: 'Rent' } });
    const sell = await Property.count({ where: { transactionType: 'Sell' } });
    const sold = await Property.count({ where: { transactionType: 'Sold' } });
    res.json({ total, rent, sell, sold });
  } catch (error) {
    res.status(500).json({ message: 'Stats Failed', error: error.message });
  }
};