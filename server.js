/**
 * DecodeLabs — Project 3: Database Integration
 * Node.js + Express + MongoDB + Mongoose
 * Full CRUD with persistent storage
 */

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');

const userRoutes    = require('./routes/users');
const contactRoutes = require('./routes/contacts');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Database Connection ───────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected:', mongoose.connection.host);

    // Seed sample data if database is empty
    const User = require('./models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany([
        { name: 'Sara Raza',  email: 'sara@buildflow.com',  role: 'admin'  },
        { name: 'Ahmed Khan', email: 'ahmed@buildflow.com', role: 'editor' },
        { name: 'Maria José', email: 'maria@buildflow.com', role: 'viewer' },
      ]);
      console.log('🌱 Sample data seeded');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Running without database — update MONGODB_URI in .env');
  }
};

connectDB();

// ── Routes ────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'BuildFlow API v3 — Database Integration 🗄️',
    database: mongoose.connection.readyState === 1 ? '✅ MongoDB Connected' : '❌ Not Connected',
    endpoints: [
      'GET    /api/users              - Get all users',
      'GET    /api/users?search=sara  - Search users',
      'GET    /api/users?role=admin   - Filter by role',
      'GET    /api/users/:id          - Get one user',
      'POST   /api/users              - Create user',
      'PUT    /api/users/:id          - Update user',
      'DELETE /api/users/:id          - Delete user',
      'GET    /api/contacts           - Get all contacts',
      'POST   /api/contacts           - Submit contact',
      'PATCH  /api/contacts/:id/read  - Mark as read',
      'GET    /api/stats              - Dashboard stats',
    ]
  });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const User    = require('./models/User');
    const Contact = require('./models/Contact');
    const [total, admins, editors, viewers, contacts, unread] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'editor' }),
      User.countDocuments({ role: 'viewer' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
    ]);
    res.json({
      success: true,
      message: 'Stats from MongoDB',
      timestamp: new Date().toISOString(),
      data: {
        totalUsers: total,
        roles: { admin: admins, editor: editors, viewer: viewers },
        totalContacts: contacts,
        unreadMessages: unread,
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/api/users',    userRoutes);
app.use('/api/contacts', contactRoutes);

// Serve frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 BuildFlow API v3 running at http://localhost:${PORT}`);
  console.log(`🗄️  Database: MongoDB + Mongoose`);
  console.log(`📋 API Docs: http://localhost:${PORT}/api\n`);
});

module.exports = app;
