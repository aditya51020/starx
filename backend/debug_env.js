import 'dotenv/config';

console.log('--- DEBUG ENV ---');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Unset');
console.log('CLOUDINARY_CLOUD:', process.env.CLOUDINARY_CLOUD);
console.log('CLOUDINARY_KEY:', process.env.CLOUDINARY_KEY);
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET);
console.log('-----------------');
