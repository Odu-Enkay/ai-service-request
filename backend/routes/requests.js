const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendConfirmationEmail } = require('../services/emailService');

// Generate unique request number
function generateRequestNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REQ-${year}-${random}`;
}

// POST /api/requests - Submit new request
router.post('/', async (req, res) => {
  try {
    const { name, email, description } = req.body;

    // Basic validation
    if (!name || !email || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const requestNumber = generateRequestNumber();

    const result = await db.query(
      `INSERT INTO requests (request_number, name, email, description)   
       VALUES ($1, $2, $3, $4) RETURNING id, request_number,created_at`,
      [requestNumber, name, email, description]
    );

    console.log('New request from DB:', result.rows[0]);
    console.log('Calling sendConfirmationEmail with trackingId:', result.rows[0].request_number);


    const newRequest = result.rows[0];

    // Send confirmation email (do not await; failures are logged internally)
    // the row property is "request_number" (snake_case), not camelCase.
    sendConfirmationEmail({
      to: email,
      name,
      trackingId: newRequest.request_number || requestNumber,
      description,
    }).catch(err => {
      console.error('Unhandled background email error:', err);
    });

    res.status(201).json({
      message: 'Request submitted successfully',
      request: newRequest
    });

  } catch (err) {
    console.error('Error submitting request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/requests/:id - Public tracking (we'll add later)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT request_number, name, description, status, created_at 
       FROM requests WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;