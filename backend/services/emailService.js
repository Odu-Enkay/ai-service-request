const nodemailer = require('nodemailer');

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS set?', process.env.GMAIL_PASS ? 'Yes' : 'No');

// transporter configured to use Gmail
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
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          .tracking-id { font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Service Request Received</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for submitting your service request. We've received it and a support agent will review it shortly.</p>
            
            <div class="tracking-id">
              Tracking ID: ${trackingId}
            </div>
            
            <p><strong>Request Summary:</strong></p>
            <p>${shortDesc}</p>
            
            <!-- TRACKING LINK BUTTON -->
            <div style="text-align: center;">
              <a href="http://localhost:5173/track/${trackingId}" class="button">
                Track Your Request
              </a>
            </div>
            
            <p>You'll receive email updates when your request status changes.</p>
            
            <p>Thank you,<br>Support Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Support Team" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Request Confirmed: ${trackingId}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${to} (messageId: ${info.messageId})`);
  } catch (err) {
    console.error('❌ Error sending confirmation email:', err);
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

    const statusEmojis = {
      'In Progress': '🔄',
      'Resolved': '✅'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${status === 'Resolved' ? '#28a745' : '#ffc107'}; color: ${status === 'Resolved' ? 'white' : '#333'}; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          .tracking-id { font-size: 20px; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${statusEmojis[status] || ''} Request Status Update</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your request <strong>${trackingId}</strong> ${statusMessages[status] || 'has been updated'}.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <strong>Current Status:</strong> 
                <span style="color: ${status === 'Resolved' ? '#28a745' : '#ffc107'}; font-weight: bold;">
                  ${status} ${statusEmojis[status] || ''}
                </span>
              </div>
            </div>
            
            <!-- TRACKING LINK BUTTON -->
            <div style="text-align: center;">
              <a href="http://localhost:5173/track/${trackingId}" class="button">
                View Request Details
              </a>
            </div>
            
            <p>Thank you for using our service.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Support Team" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Request ${trackingId} ${status}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status email sent to ${to}`);
  } catch (err) {
    console.error('❌ Error sending status email:', err);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail
};