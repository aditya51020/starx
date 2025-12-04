import Property from '../models/Property.js';
import { slugify } from '../utils/slugify.js';

// GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const { region, transactionType, propertyType, minPrice, maxPrice, bhk, featured, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (region) filter.region = region;
    if (transactionType) filter.transactionType = transactionType;
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };
    if (bhk) filter.bhk = +bhk;
    if (featured === 'true') filter.featured = true;
    if (req.query.ids) {
      const ids = req.query.ids.split(',').filter(id => id.match(/^[0-9a-fA-F]{24}$/));
      if (ids.length > 0) filter._id = { $in: ids };
    }

    const properties = await Property.find(filter)
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);
    res.json({ data: properties, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const p = await Property.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Not found' });
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
      let existing = await Property.findOne({ slug });
      let counter = 1;
      while (existing) {
        slug = `${slugify(data.title)}-${counter}`;
        existing = await Property.findOne({ slug });
        counter++;
      }
      data.slug = slug;
    }

    const prop = await Property.create(data);
    res.status(201).json(prop);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
};

// PUT /api/admin/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const data = req.body;

    // Update slug if title changes
    if (data.title) {
      let slug = slugify(data.title);
      // Ensure unique slug (excluding current doc)
      let existing = await Property.findOne({ slug, _id: { $ne: req.params.id } });
      let counter = 1;
      while (existing) {
        slug = `${slugify(data.title)}-${counter}`;
        existing = await Property.findOne({ slug, _id: { $ne: req.params.id } });
        counter++;
      }
      data.slug = slug;
    }

    const prop = await Property.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(prop);
  } catch (error) {
    res.status(400).json({ message: 'Update Failed', error: error.message });
  }
};

// DELETE /api/admin/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete Failed', error: error.message });
  }
};

// DELETE /api/admin/properties/bulk
export const bulkDelete = async (req, res) => {
  try {
    await Property.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ msg: 'Bulk deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Bulk Delete Failed', error: error.message });
  }
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const total = await Property.countDocuments();
    const rent = await Property.countDocuments({ transactionType: 'Rent' });
    const sell = await Property.countDocuments({ transactionType: 'Sell' });
    const sold = await Property.countDocuments({ transactionType: 'Sold' });
    res.json({ total, rent, sell, sold });
  } catch (error) {
    res.status(500).json({ message: 'Stats Failed', error: error.message });
  }
};