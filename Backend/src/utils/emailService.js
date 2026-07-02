import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'PahadPerChale <noreply@pahadperchale.com>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Shared template parts ────────────────────────────────────────────────────

const baseStyle = `
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
  margin: 0; padding: 0;
`;

const header = (title) => `
  <div style="background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); padding: 40px 20px; text-align: center;">
    <div style="font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">
      🏔️ PahadPerChale
    </div>
    <div style="color: rgba(255,255,255,0.85); font-size: 15px; margin-top: 6px;">Explore the Himalayas</div>
    ${title ? `<h1 style="color:#fff;font-size:22px;font-weight:700;margin:20px 0 0;">${title}</h1>` : ''}
  </div>
`;

const footer = `
  <div style="background: #1e293b; padding: 32px 20px; text-align: center;">
    <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">PahadPerChale — Crafting Himalayan Memories</p>
    <p style="color: #64748b; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} PahadPerChale. All rights reserved.<br/>
      This is an automated message, please do not reply directly.
    </p>
  </div>
`;

const button = (href, label, color = '#10b981') => `
  <div style="text-align: center; margin: 28px 0;">
    <a href="${href}" style="
      display: inline-block;
      background: ${color};
      color: #fff;
      padding: 14px 36px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.2px;
    ">${label}</a>
  </div>
`;

const infoRow = (label, value) => `
  <tr>
    <td style="padding: 10px 16px; color: #64748b; font-size: 14px; width: 40%;">${label}</td>
    <td style="padding: 10px 16px; color: #1e293b; font-size: 14px; font-weight: 600;">${value}</td>
  </tr>
`;

const wrap = (content) => `
  <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="${baseStyle}">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
      ${content}
    </div>
    <p style="text-align:center;color:#94a3b8;font-size:12px;margin:20px 0;">
      If you did not request this email, please ignore it.
    </p>
  </body></html>
`;

// ─── Email Templates ──────────────────────────────────────────────────────────

const templates = {
  verifyEmail: (name, token) => ({
    subject: 'Verify Your Email — PahadPerChale',
    html: wrap(`
      ${header('Verify Your Email Address')}
      <div style="padding: 36px 32px;">
        <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
          Welcome to PahadPerChale! We're thrilled to have you on board. Before you start exploring
          the most beautiful destinations in the Himalayas, please verify your email address.
        </p>
        ${button(`${CLIENT_URL}/verify-email/${token}`, '✉️ Verify Email Address')}
        <p style="font-size:13px;color:#94a3b8;text-align:center;margin-top:16px;">
          This link expires in <strong>24 hours</strong>.
          If the button doesn't work, copy and paste this URL:
        </p>
        <p style="font-size:12px;color:#0ea5e9;word-break:break-all;text-align:center;">
          ${CLIENT_URL}/verify-email/${token}
        </p>
      </div>
      ${footer}
    `),
  }),

  passwordReset: (name, token) => ({
    subject: 'Reset Your Password — PahadPerChale',
    html: wrap(`
      ${header('Reset Your Password')}
      <div style="padding: 36px 32px;">
        <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
          We received a request to reset your PahadPerChale password.
          Click the button below to create a new password. This link expires in <strong>1 hour</strong>.
        </p>
        ${button(`${CLIENT_URL}/reset-password/${token}`, '🔑 Reset My Password', '#0ea5e9')}
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px;margin-top:20px;">
          <p style="font-size:13px;color:#92400e;margin:0;">
            ⚠️ If you did not request a password reset, please ignore this email.
            Your account is still secure.
          </p>
        </div>
      </div>
      ${footer}
    `),
  }),

  welcome: (name) => ({
    subject: 'Welcome to PahadPerChale! 🏔️',
    html: wrap(`
      ${header('')}
      <div style="padding: 36px 32px; text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">🏔️</div>
        <h1 style="font-size:26px;font-weight:800;color:#0f172a;margin:0 0 12px;">Welcome, ${name}!</h1>
        <p style="font-size:15px;color:#475569;line-height:1.7;max-width:460px;margin:0 auto 24px;">
          Your account is now active. Explore breathtaking destinations, book curated packages,
          and create unforgettable Himalayan memories.
        </p>
        <div style="display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;">
          ${['🗺️ Destinations', '📦 Packages', '🏨 Hotels', '🚗 Vehicles'].map(i => `
            <span style="background:#f0fdf4;color:#065f46;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;">${i}</span>
          `).join('')}
        </div>
        ${button(`${CLIENT_URL}/packages`, 'Explore Packages')}
      </div>
      ${footer}
    `),
  }),

  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed — ${booking.bookingId || 'Your Trip'} | PahadPerChale`,
    html: wrap(`
      ${header('Booking Confirmed!')}
      <div style="padding: 36px 32px;">
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
          <div style="font-size:40px;margin-bottom:8px;">✅</div>
          <p style="font-size:17px;font-weight:700;color:#065f46;margin:0;">Your booking is confirmed!</p>
          <p style="font-size:13px;color:#166534;margin:6px 0 0;">Booking ID: <strong>${booking.bookingId}</strong></p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;">
          ${infoRow('Name', booking.customerName)}
          ${infoRow('Package / Vehicle', booking.packageName || booking.vehicleName || 'Tour Package')}
          ${infoRow('Travel Date', new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))}
          ${infoRow('Travelers', `${booking.travelers} person(s)`)}
          ${infoRow('Total Amount', `₹${(booking.totalAmount || 0).toLocaleString('en-IN')}`)}
          ${infoRow('Status', '✅ Confirmed')}
        </table>
        ${button(`${CLIENT_URL}/bookings/my`, 'View My Bookings', '#10b981')}
        <p style="font-size:13px;color:#94a3b8;text-align:center;">
          Questions? Contact us at support@pahadperchale.com
        </p>
      </div>
      ${footer}
    `),
  }),

  bookingApproved: (booking) => ({
    subject: `Booking Approved! 🎉 — ${booking.bookingId} | PahadPerChale`,
    html: wrap(`
      ${header('Your Booking is Approved!')}
      <div style="padding: 36px 32px;">
        <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
          <div style="font-size:48px;margin-bottom:8px;">🎉</div>
          <p style="font-size:18px;font-weight:700;color:#065f46;margin:0;">Great news, ${booking.customerName}!</p>
          <p style="font-size:14px;color:#166534;margin:8px 0 0;">Your booking has been approved by our team.</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;">
          ${infoRow('Booking ID', booking.bookingId)}
          ${infoRow('Package', booking.packageName || booking.vehicleName || 'Tour')}
          ${infoRow('Travel Date', new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))}
          ${infoRow('Travelers', `${booking.travelers}`)}
          ${infoRow('Amount', `₹${(booking.totalAmount || 0).toLocaleString('en-IN')}`)}
        </table>
        ${button(`${CLIENT_URL}/bookings/my`, 'View Booking Details', '#10b981')}
      </div>
      ${footer}
    `),
  }),

  bookingCancelled: (booking, reason) => ({
    subject: `Booking Cancelled — ${booking.bookingId} | PahadPerChale`,
    html: wrap(`
      ${header('Booking Cancelled')}
      <div style="padding: 36px 32px;">
        <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
          <div style="font-size:40px;margin-bottom:8px;">❌</div>
          <p style="font-size:17px;font-weight:700;color:#991b1b;margin:0;">Booking Cancelled</p>
          <p style="font-size:13px;color:#b91c1c;margin:6px 0 0;">Booking ID: ${booking.bookingId}</p>
        </div>
        <p style="color:#475569;font-size:15px;line-height:1.7;">
          Hi <strong>${booking.customerName}</strong>, your booking for
          <strong>${booking.packageName || booking.vehicleName || 'your tour'}</strong> has been cancelled.
          ${reason ? `<br/><br/>Reason: <em>${reason}</em>` : ''}
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.7;">
          If you believe this was a mistake or need assistance, please contact us at
          <a href="mailto:support@pahadperchale.com" style="color:#0ea5e9;">support@pahadperchale.com</a>.
        </p>
        ${button(`${CLIENT_URL}/packages`, 'Browse Other Packages', '#64748b')}
      </div>
      ${footer}
    `),
  }),

  bookingRejected: (booking, reason) => ({
    subject: `Booking Update — ${booking.bookingId} | PahadPerChale`,
    html: wrap(`
      ${header('Booking Not Available')}
      <div style="padding: 36px 32px;">
        <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi <strong>${booking.customerName}</strong>,</p>
        <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
          We regret to inform you that your booking
          <strong>(${booking.bookingId})</strong> for
          <strong>${booking.packageName || booking.vehicleName || 'your tour'}</strong>
          could not be confirmed at this time.
          ${reason ? `<br/><br/>Reason: <em>${reason}</em>` : ''}
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          We apologize for the inconvenience. Please explore our other packages or
          contact us for a personalized alternative.
        </p>
        ${button(`${CLIENT_URL}/packages`, 'Explore Alternatives', '#f59e0b')}
      </div>
      ${footer}
    `),
  }),

  customTourSubmitted: (req) => ({
    subject: `Custom Tour Request Received — ${req.requestId} | PahadPerChale`,
    html: wrap(`
      ${header('Custom Tour Request Received!')}
      <div style="padding: 36px 32px;">
        <div style="background:#f0f9ff;border:1px solid #7dd3fc;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
          <div style="font-size:40px;margin-bottom:8px;">🗺️</div>
          <p style="font-size:17px;font-weight:700;color:#0c4a6e;margin:0;">Request Received!</p>
          <p style="font-size:13px;color:#075985;margin:6px 0 0;">Request ID: ${req.requestId}</p>
        </div>
        <p style="color:#475569;font-size:15px;line-height:1.7;">
          Hi <strong>${req.contactName || 'Traveler'}</strong>, we've received your custom tour request.
          Our travel experts will review it and get back to you within <strong>24-48 hours</strong>
          with a personalized itinerary and quote.
        </p>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;margin-top:20px;">
          ${infoRow('Destinations', Array.isArray(req.destinations) ? req.destinations.join(', ') : req.destinations || 'Not specified')}
          ${infoRow('Travel Dates', `${req.startDate ? new Date(req.startDate).toLocaleDateString('en-IN') : 'TBD'} to ${req.endDate ? new Date(req.endDate).toLocaleDateString('en-IN') : 'TBD'}`)}
          ${infoRow('Travelers', `${req.adults || 1} adult(s), ${req.children || 0} child(ren)`)}
          ${infoRow('Budget', `₹${(req.budget || 0).toLocaleString('en-IN')} (${req.budgetType === 'per_person' ? 'per person' : 'total'})`)}
        </table>
        ${button(`${CLIENT_URL}/my-custom-tours`, 'View My Requests', '#0ea5e9')}
      </div>
      ${footer}
    `),
  }),

  adminMessage: (user, subject, messageBody) => ({
    subject: `Message from PahadPerChale Support — ${subject}`,
    html: wrap(`
      ${header('Message from Support Team')}
      <div style="padding: 36px 32px;">
        <p style="font-size:16px;color:#334155;margin:0 0 16px;">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Subject: <strong>${subject}</strong></p>
        <div style="background:#f8fafc;border-left:4px solid #10b981;border-radius:0 12px 12px 0;padding:20px;margin-bottom:24px;">
          <p style="color:#334155;font-size:15px;line-height:1.8;margin:0;white-space:pre-wrap;">${messageBody}</p>
        </div>
        ${button(`${CLIENT_URL}/my-messages`, 'View Messages', '#0ea5e9')}
        <p style="font-size:13px;color:#94a3b8;text-align:center;">
          Reply to this message from your dashboard.
        </p>
      </div>
      ${footer}
    `),
  }),
};

// ─── Send helper ─────────────────────────────────────────────────────────────

async function sendEmail(to, template) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email send');
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: template.subject,
      html: template.html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    // Never throw — email failure must not break API response
    console.error(`[Email] Failed to send to ${to}:`, err.message);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const emailService = {
  sendVerificationEmail: (email, name, token) =>
    sendEmail(email, templates.verifyEmail(name, token)),

  sendPasswordReset: (email, name, token) =>
    sendEmail(email, templates.passwordReset(name, token)),

  sendWelcome: (email, name) =>
    sendEmail(email, templates.welcome(name)),

  sendBookingConfirmation: (email, booking) =>
    sendEmail(email, templates.bookingConfirmation(booking)),

  sendBookingApproved: (email, booking) =>
    sendEmail(email, templates.bookingApproved(booking)),

  sendBookingCancelled: (email, booking, reason) =>
    sendEmail(email, templates.bookingCancelled(booking, reason)),

  sendBookingRejected: (email, booking, reason) =>
    sendEmail(email, templates.bookingRejected(booking, reason)),

  sendCustomTourSubmitted: (email, request) =>
    sendEmail(email, templates.customTourSubmitted(request)),

  sendAdminMessage: (email, user, subject, messageBody) =>
    sendEmail(email, templates.adminMessage(user, subject, messageBody)),
};

export default emailService;
