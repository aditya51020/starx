
import { v2 as cloudinary } from 'cloudinary';
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImages = upload.array('images', 10);

export const handleUpload = async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ghaziabad_realestate',
            allowed_formats: ['jpg', 'png', 'jpeg'],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    console.log('Upload successful, URLs:', urls);
    res.json({ urls });
  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message || error });
  }
};

