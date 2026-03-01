const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// CREATE FIRST ADMIN (one-time setup)
// In production, this need to be disabled after the first admin is created, or protected by an environment variable.
router.post('/setup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if any admin exists
    const existing = await db.query('SELECT COUNT(*) FROM admins ');
    const adminCount = parseInt(existing.rows[0].count);
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin already exists. Use login.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save admin
    const result = await db.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: result.rows[0]
    });
  } catch (err) {
    console.error('Setup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CHECK IF ANY ADMIN EXISTS (public endpoint)
router.get('/check', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM admins');
    const count = parseInt(result.rows[0].count);
    res.json({ hasAdmin: count > 0 });
  } catch (err) {
    console.error('Error checking admins:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ADMIN LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find admin
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// VERIFY TOKEN (for frontend to check session)
router.get('/verify', authenticateAdmin, (req, res) => {
  res.json({ valid: true, adminId: req.adminId });
});

// GET ALL REQUESTS (protected admin route example)
router.get('/requests', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM requests ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;