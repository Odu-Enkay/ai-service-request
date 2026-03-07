const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a confirmation email using Resend
 */
async function sendConfirmationEmail({ to, name, trackingId, description }) {
  try {
    // Truncate description for email
    const shortDesc = description.length > 150 
      ? description.substring(0, 150) + '...' 
      : description;

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
            
            <div style="text-align: center;">
              <a href="https://ai-service-request.vercel.app/track/${trackingId}" class="button">
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

    const { data, error } = await resend.emails.send({
      from: 'Support <onboarding@resend.dev>', // TEMPORARY - we'll fix this next
      to: [to],
      subject: `Request Confirmed: ${trackingId}`,
      html: html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return;
    }

    console.log(`✅ Email sent via Resend to ${to}`, data);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

/**
 * Send status update email using Resend
 */
async function sendStatusUpdateEmail({ to, name, trackingId, status }) {
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
            
            <div style="text-align: center;">
              <a href="https://ai-service-request.vercel.app/track/${trackingId}" class="button">
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

    const { data, error } = await resend.emails.send({
      from: 'Support <onboarding@resend.dev>', // TEMPORARY
      to: [to],
      subject: `Request ${trackingId} ${status}`,
      html: html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return;
    }

    console.log(`✅ Status email sent via Resend to ${to}`);
  } catch (error) {
    console.error('❌ Error sending status email:', error);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail
};