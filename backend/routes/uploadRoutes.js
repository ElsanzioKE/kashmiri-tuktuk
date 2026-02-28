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
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files uploaded');
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.json({ success: true, data: images });
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
