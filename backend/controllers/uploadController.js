import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import {
  CLOUDINARY_CLOUD,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
} from '../config.js';


if (!CLOUDINARY_CLOUD || !CLOUDINARY_KEY || !CLOUDINARY_SECRET) {
  console.error('❌ Cloudinary config missing! Please check your .env file.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ghaziabad_realestate',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

export const uploadImages = upload.array('images', 10);

export const handleUpload = (req, res) => {
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
};
