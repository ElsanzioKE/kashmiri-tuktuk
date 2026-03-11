const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');

// @desc    Upload image(s)
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    console.log('Upload request received:', {
      files: req.files?.length || 0,
      user: req.user?.email,
      timestamp: new Date().toISOString()
    });

    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files uploaded');
    }

    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      res.status(500);
      throw new Error('Server configuration error: Cloudinary not configured');
    }

    try {
      const images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
      }));

      console.log('Upload successful:', images.map(img => ({ url: img.url, publicId: img.publicId })));
      
      res.json({ 
        success: true, 
        data: images,
        message: `${images.length} image(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500);
      throw new Error('Failed to process uploaded images');
    }
  })
);

// @desc    Delete image
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete(
  '/:publicId',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, message: 'Image deleted' });
  })
);

module.exports = router;
