const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');

const send = (res, status, success, message, data = null) => {
  const r = { success, message, timestamp: new Date().toISOString() };
  if (data !== null) r.data = data;
  return res.status(status).json(r);
};

// POST /api/contacts - Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    send(res, 201, true, 'Message received! We will get back to you soon.', contact);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return send(res, 400, false, msg);
    }
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// GET /api/contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    send(res, 200, true, `${contacts.length} contact(s) found`, contacts);
  } catch (err) {
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

// PATCH /api/contacts/:id/read - Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) return send(res, 404, false, 'Contact not found');
    send(res, 200, true, 'Marked as read', contact);
  } catch (err) {
    send(res, 500, false, 'Server error: ' + err.message);
  }
});

module.exports = router;
