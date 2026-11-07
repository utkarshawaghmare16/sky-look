const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Everyone: dates already confirmed (cannot be booked)
router.get('/taken-dates', async (req, res) => {
  try {
    const dates = await Booking.distinct('eventDate', { status: 'confirmed' });
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer: create a booking
router.post('/', protect, async (req, res) => {
  try {
    const { serviceId, eventDate, venue, guests, phone, notes } = req.body;

    if (!serviceId || !eventDate || !venue || !phone) {
      return res.status(400).json({ message: 'Service, date, venue and phone are required' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (eventDate < today) {
      return res.status(400).json({ message: 'Date cannot be in the past' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const taken = await Booking.findOne({ eventDate, status: 'confirmed' });
    if (taken) {
      return res.status(409).json({ message: 'This date is already booked. Please choose another date.' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service: service._id,
      serviceTitle: service.title,
      eventDate,
      venue,
      guests: Number(guests) || 0,
      phone,
      notes,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer: my bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: all bookings
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ eventDate: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: confirm / cancel
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (status === 'confirmed') {
      const clash = await Booking.findOne({
        eventDate: booking.eventDate,
        status: 'confirmed',
        _id: { $ne: booking._id },
      });
      if (clash) {
        return res.status(409).json({ message: 'Another booking is already confirmed for this date' });
      }
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;