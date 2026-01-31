
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

export const uploadImages = upload.array('images', 20);

export const handleUpload = async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ghaziabad_realestate',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'webm'],
            timeout: 60000 // 60s timeout
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    // Use allSettled so one failure doesn't stop the rest
    const results = await Promise.allSettled(uploadPromises);

    // Filter out successful uploads
    const urls = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    // Log failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some uploads failed:', failures.map(f => f.reason));
    }

    console.log(`Upload complete. Success: ${urls.length}, Failed: ${failures.length}`);

    res.json({
      urls,
      failed: failures.length,
      message: failures.length > 0 ? `${urls.length} uploaded, ${failures.length} failed` : 'All files uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message || error });
  }
};

