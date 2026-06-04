/**
 * Users Routes - Full CRUD with MongoDB
 * CREATE=POST=INSERT | READ=GET=SELECT | UPDATE=PUT=UPDATE | DELETE=DELETE=DELETE
 */

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// ── Helper response ───────────────────────────────────────
const send = (res, status, success, message, data = null) => {
  const r = { success, message, timestamp: new Date().toISOString() };
  if (data !== null) r.data = data;
  return res.status(status).json(r);
};

// ── GET /api/users ── Read All (SELECT * FROM users) ──────
router.get('/', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (role)   filter.role = role;
    if (search) filter.$or  = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    send(res, 200, true, `${users.length} user(s) found`, {
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// ── GET /api/users/:id ── Read One (SELECT WHERE id=?) ────
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return send(res, 404, false, 'User not found');
    send(res, 200, true, 'User fetched', user);
  } catch (err) {
    if (err.name === 'CastError') return send(res, 400, false, 'Invalid user ID format');
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// ── POST /api/users ── Create (INSERT INTO users) ─────────
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    // Mongoose schema handles all validation automatically
    const user = new User({ name, email, role });
    await user.save();
    send(res, 201, true, 'User created successfully', user);
  } catch (err) {
    // Duplicate email (unique constraint violation)
    if (err.code === 11000) return send(res, 409, false, 'A user with this email already exists');
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return send(res, 400, false, msg);
    }
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// ── PUT /api/users/:id ── Update (UPDATE users SET ...) ───
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }  // runValidators = re-check schema rules
    );
    if (!user) return send(res, 404, false, 'User not found');
    send(res, 200, true, 'User updated successfully', user);
  } catch (err) {
    if (err.code === 11000)       return send(res, 409, false, 'Email already in use');
    if (err.name === 'CastError') return send(res, 400, false, 'Invalid user ID format');
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return send(res, 400, false, msg);
    }
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// ── DELETE /api/users/:id ── Delete (DELETE FROM users) ───
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return send(res, 404, false, 'User not found');
    send(res, 200, true, 'User deleted successfully', user);
  } catch (err) {
    if (err.name === 'CastError') return send(res, 400, false, 'Invalid user ID format');
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

module.exports = router;
