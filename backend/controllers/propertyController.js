import Property from '../models/Property.js';
import { slugify } from '../utils/slugify.js';
import { Op } from 'sequelize';

// GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const { region, transactionType, propertyType, minPrice, maxPrice, bhk, featured, amenities, search, limit = 20, page = 1 } = req.query;
    const where = {};

    if (region) where.region = region;
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

    // Generate slug from title
    if (data.title) {
      let slug = slugify(data.title);
      // Check for duplicate slug
      let existing = await Property.findOne({ where: { slug } });
      let counter = 1;
      while (existing) {
        slug = `${slugify(data.title)}-${counter}`;
        existing = await Property.findOne({ where: { slug } });
        counter++;
      }
      data.slug = slug;
    }

    const prop = await Property.create(data);
    res.status(201).json(prop);
  } catch (error) {
    console.error("Create Property Error", error);
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
};

// PUT /api/admin/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const data = req.body;
    const prop = await Property.findByPk(req.params.id);

    if (!prop) return res.status(404).json({ message: 'Property not found' });

    // Update slug if title changes
    if (data.title && data.title !== prop.title) {
      let slug = slugify(data.title);
      // Ensure unique slug (excluding current doc)
      let existing = await Property.findOne({
        where: {
          slug,
          id: { [Op.ne]: req.params.id }
        }
      });
      let counter = 1;
      while (existing) {
        slug = `${slugify(data.title)}-${counter}`;
        existing = await Property.findOne({
          where: {
            slug,
            id: { [Op.ne]: req.params.id }
          }
        });
        counter++;
      }
      data.slug = slug;
    }

    await prop.update(data);
    res.json(prop);
  } catch (error) {
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