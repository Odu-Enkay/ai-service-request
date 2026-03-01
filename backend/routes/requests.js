const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendConfirmationEmail } = require('../services/emailService');
const { analyzeDescription } = require('../services/aiService'); 

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

    // Insert request into database
    const result = await db.query(
      `INSERT INTO requests (request_number, name, email, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, request_number, created_at`,
      [requestNumber, name, email, description]
    );

    const newRequest = result.rows[0];
    console.log('✅ Request saved:', newRequest.request_number);

    // ----- SEND CONFIRMATION EMAIL (async) -----
    sendConfirmationEmail({
      to: email,
      name: name,
      trackingId: newRequest.request_number,
      description: description
    }).catch(err => console.error('Email error:', err));

    // ----- AI ANALYSIS (async) -----
    // Run AI in background - doesn't block response
    (async () => {
      try {
        console.log('🤖 Starting AI analysis for request:', newRequest.request_number);
        
        const aiResult = await analyzeDescription(description);
        
        if (aiResult) {
          // Update the request with AI results
          await db.query(
            `UPDATE requests 
             SET ai_category = $1, ai_priority = $2, ai_summary = $3, ai_draft_response = $4, updated_at = NOW()
             WHERE id = $5`,
            [aiResult.category, aiResult.priority, aiResult.summary, aiResult.draftResponse, newRequest.id]
          );
          console.log('✅ AI analysis complete for:', newRequest.request_number, aiResult);
        } else {
          console.log('⚠️ AI analysis returned no result for:', newRequest.request_number);
        }
      } catch (aiErr) {
        console.error('❌ AI background processing error:', aiErr);
      }
    })();

    // Return success response immediately (don't wait for AI/email)
    res.status(201).json({
      message: 'Request submitted successfully',
      request: {
        id: newRequest.id,
        request_number: newRequest.request_number,
        created_at: newRequest.created_at
      }
    });

  } catch (err) {
    console.error('❌ Error submitting request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/requests/track/:requestNumber - Public tracking
router.get('/track/:requestNumber', async (req, res) => {
  try {
    const { requestNumber } = req.params;
    
    const result = await db.query(
      `SELECT 
        request_number, 
        name, 
        description, 
        status, 
        created_at,
        updated_at,
        resolved_at
       FROM requests 
       WHERE request_number = $1`,
      [requestNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error tracking request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;