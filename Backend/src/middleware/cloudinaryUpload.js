import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

// Memory storage — files never touch disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WebP images are allowed'), false);
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

export const upload = multer({ storage, fileFilter, limits });
export const uploadMultiple = multer({ storage, fileFilter, limits });

/**
 * Upload a buffer to Cloudinary in a given folder.
 * @param {Buffer} buffer
 * @param {string} folder  e.g. 'packages', 'destinations', 'hotels', 'vehicles', 'users'
 * @param {object} [options]  extra cloudinary options
 * @returns {{ url: string, public_id: string }}
 */
export async function uploadToCloudinary(buffer, folder, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `pahadperchale/${folder}`,
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Safe to call with null/undefined — just resolves.
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Cloudinary delete failed for ${publicId}:`, err.message);
  }
}

/**
 * Express middleware: upload a single image field → attaches to req.uploadedImage
 * Usage: router.post('/', upload.single('image'), handleSingleUpload('packages'), controller)
 */
export function handleSingleUpload(folder) {
  return async (req, res, next) => {
    if (!req.file) return next();
    try {
      const result = await uploadToCloudinary(req.file.buffer, folder);
      req.uploadedImage = result;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Express middleware: upload multiple image fields → attaches to req.uploadedImages[]
 * Usage: router.post('/', uploadMultiple.array('images', 5), handleMultipleUploads('hotels'), controller)
 */
export function handleMultipleUploads(folder) {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();
    try {
      const results = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, folder))
      );
      req.uploadedImages = results;
      next();
    } catch (err) {
      next(err);
    }
  };
}
