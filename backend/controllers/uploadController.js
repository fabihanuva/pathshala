const cloudinary = require('../config/cloudinary');

// @route POST /api/upload/image
// Instructor/Admin - uploads a course thumbnail (or any image) to Cloudinary,
// returns the hosted URL to store on the Course document.
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Stream the in-memory buffer to Cloudinary rather than saving to disk first
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lms-course-thumbnails', resource_type: 'image' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
