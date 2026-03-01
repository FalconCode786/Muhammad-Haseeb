const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // For other services (SMTP)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email helper
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || ''
  };

  const info = await transporter.sendMail(message);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

// Email templates
const emailTemplates = {
  // Admin notification for new contact
  adminContactNotification: (data) => ({
    subject: `New Contact Form Submission - ${data.projectName || 'General Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Project Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Contact:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.contactNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Project Type:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.projectType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Project Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.projectName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Duration:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.duration || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Database:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.database || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Technologies:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.technologies || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>UI Link:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${data.uiLink ? `<a href="${data.uiLink}" target="_blank">${data.uiLink}</a>` : 'N/A'}
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${data.message || 'No additional message'}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
          Submitted on: ${new Date(data.createdAt).toLocaleString()}
        </p>
      </div>
    `
  }),

  // User confirmation email
  userConfirmation: (data) => ({
    subject: 'Thank you for contacting Muhammad Haseeb',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You!</h1>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <p style="font-size: 16px; color: #374151;">Hi ${data.fullName},</p>
          <p style="font-size: 16px; color: #374151;">
            Thank you for reaching out! I've received your inquiry about <strong>${data.projectType || 'your project'}</strong>.
          </p>
          <p style="font-size: 16px; color: #374151;">
            I'll review your requirements and get back to you within <strong>24 hours</strong>.
          </p>
          <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #dc2626;">What happens next?</h3>
            <ul style="color: #374151;">
              <li>I'll review your project details</li>
              <li>Prepare a customized proposal</li>
              <li>Schedule a free consultation if needed</li>
              <li>Send you a detailed quote</li>
            </ul>
          </div>
          <p style="font-size: 16px; color: #374151;">
            If you have any urgent questions, feel free to reply to this email.
          </p>
          <p style="font-size: 16px; color: #374151;">
            Best regards,<br>
            <strong>Muhammad Haseeb</strong><br>
            <span style="color: #6b7280;">Full Stack Developer & UI/UX Designer</span>
          </p>
        </div>
        <div style="padding: 20px; text-align: center; background: #f9fafb;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated response. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `
  }),

  // Admin notification for new consultation
  adminConsultationNotification: (data) => ({
    subject: `New Consultation Booking - ${data.topic}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Consultation Booked</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Topic:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.topic}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #dc2626; font-weight: bold;">${new Date(data.date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #dc2626; font-weight: bold;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Type:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: capitalize;">${data.type}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${data.message || 'No additional message'}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #991b1b;"><strong>Action Required:</strong> Please confirm this booking and send meeting details to the client.</p>
        </div>
      </div>
    `
  }),

  // User consultation confirmation
  userConsultationConfirmation: (data) => ({
    subject: 'Your Consultation is Booked - Muhammad Haseeb',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Consultation Booked!</h1>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <p style="font-size: 16px; color: #374151;">Hi ${data.name},</p>
          <p style="font-size: 16px; color: #374151;">
            Your consultation has been scheduled successfully. Here are the details:
          </p>
          
          <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 12px;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 10px; color: #6b7280;">Topic:</td>
                <td style="padding: 10px; font-weight: bold; color: #111827;">${data.topic}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #6b7280;">Date:</td>
                <td style="padding: 10px; font-weight: bold; color: #dc2626;">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #6b7280;">Time:</td>
                <td style="padding: 10px; font-weight: bold; color: #dc2626;">${data.time}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #6b7280;">Type:</td>
                <td style="padding: 10px; font-weight: bold; color: #111827; text-transform: capitalize;">${data.type} Call</td>
              </tr>
            </table>
          </div>

          <div style="margin: 30px 0; padding: 20px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">What's Next?</h3>
            <ul style="color: #374151; padding-left: 20px;">
              <li>I'll review your requirements before our call</li>
              <li>You'll receive meeting link 2 hours before the call</li>
              <li>Please join 5 minutes early</li>
              <li>Prepare your questions and project details</li>
            </ul>
          </div>

          <p style="font-size: 16px; color: #374151;">
            If you need to reschedule, please reply to this email at least 24 hours in advance.
          </p>
          
          <p style="font-size: 16px; color: #374151;">
            Looking forward to speaking with you!<br>
            <strong>Muhammad Haseeb</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Consultation reminder
  consultationReminder: (data) => ({
    subject: 'Reminder: Consultation in 2 Hours',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h2 style="color: #dc2626;">Consultation Reminder</h2>
        <p>Hi ${data.name},</p>
        <p>This is a friendly reminder that your consultation is scheduled in <strong>2 hours</strong>.</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Topic:</strong> ${data.topic}</p>
          <p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>
        </div>
        <p>See you soon!</p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};