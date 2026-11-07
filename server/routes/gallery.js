const express = require('express');
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Everyone: list photos
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: add photo
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    const photo = await Gallery.create({ title, category, imageUrl });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete photo
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;