const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Customer: place an order
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, phone } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !address || !phone) {
      return res.status(400).json({ message: 'Items, address and phone are required' });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const qty = Number(item.qty);
      if (!qty || qty < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.stock < qty) {
        return res.status(400).json({ message: 'Not enough stock for ' + product.name });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty,
      });
      total += product.price * qty;
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      address,
      phone,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer: my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: change order status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['placed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;