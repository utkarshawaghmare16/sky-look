const express = require('express');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Everyone: list services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: add service
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, image, startingPrice } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const service = await Service.create({
      title,
      description,
      image,
      startingPrice: Number(startingPrice) || 0,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete service
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;