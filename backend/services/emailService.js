const nodemailer = require('nodemailer');

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS set?', process.env.GMAIL_PASS ? 'Yes' : 'No');

// transporter configured to use Gmail
// make sure the environment variables GMAIL_USER and GMAIL_PASS are set
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Send a confirmation email to a user after they submit a request.
 * Logs errors internally so that email failures do not affect the API response.
 *
 * @param {Object} opts
 * @param {string} opts.to - recipient email address
 * @param {string} opts.name - user full name
 * @param {string} opts.trackingId - generated request number
 * @param {string} opts.description - original request description
 */
async function sendConfirmationEmail({ to, name, trackingId, description }) {
  try {
    let shortDesc = description;
    if (shortDesc.length > 150) {
      shortDesc = shortDesc.substring(0, 150) + '...';
    }

    console.log('📧 sendConfirmationEmail received:', { to, name, trackingId, description });

    const html = `
      <h1>Service Request Received</h1>
      <p>Hi ${name},</p>
      <p>Thank you for submitting your service request. Your tracking ID is <strong>${trackingId}</strong>.</p>
      <p><strong>Request Summary:</strong> ${shortDesc}</p>
      <p>We'll keep you updated on the status.</p>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: 'Your service request has been received',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to} (messageId: ${info.messageId})`);
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    // do not rethrow; caller should continue regardless of email outcome
  }
}

// function to send status update emails when admin changes request status
const sendStatusUpdateEmail = async ({ to, name, trackingId, status }) => {
  try {
    const statusMessages = {
      'In Progress': 'is now in progress',
      'Resolved': 'has been resolved'
    };

    const html = `
      <h1>Request Status Update</h1>
      <p>Hi ${name},</p>
      <p>Your request <strong>${trackingId}</strong> ${statusMessages[status] || 'has been updated'}.</p>
      <p>You can track your request here:</p>
      <p><a href="http://localhost:5173/track/${trackingId}">View Request Status</a></p>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: `Request ${trackingId} ${status}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status email sent to ${to}`);
  } catch (err) {
    console.error('Error sending status email:', err);
  }
};


module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail
};
