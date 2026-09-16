import { MeetingRequest } from '../db/meetings';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/** Escape user-supplied values before embedding in HTML to prevent XSS / HTML-injection. */
const esc = (s: unknown): string =>
    String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

export function getAdminNotificationEmail(request: MeetingRequest): string {
    const approvalUrl = `${APP_URL}/meetings/action?token=${request.approvalToken}&action=approve`;
    const rejectionUrl = `${APP_URL}/meetings/action?token=${request.rejectionToken}&action=reject`;

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
      color: #000;
      padding: 30px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 12px 12px;
    }
    .info-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #FACC15;
    }
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: 600;
      width: 150px;
      color: #666;
    }
    .info-value {
      flex: 1;
      color: #333;
    }
    .features {
      background: #fff3cd;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .features ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .features li {
      margin: 5px 0;
    }
    .button-container {
      display: flex;
      gap: 15px;
      margin: 30px 0;
      justify-content: center;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      transition: all 0.3s;
    }
    .button-approve {
      background: #22c55e;
      color: white;
    }
    .button-approve:hover {
      background: #16a34a;
    }
    .button-reject {
      background: #ef4444;
      color: white;
    }
    .button-reject:hover {
      background: #dc2626;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .alert {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px;">🔔 New Meeting Request</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Action Required</p>
  </div>
  
  <div class="content">
    <div class="alert">
      <strong>Quick Action Needed:</strong> A potential client has requested a meeting. Review the details below and take action.
    </div>

    <div class="info-card">
      <h2 style="margin-top: 0; color: #FACC15;">Contact Information</h2>
      <div class="info-row">
        <div class="info-label">Name:</div>
        <div class="info-value"><strong>${esc(request.fullName)}</strong></div>
      </div>
      <div class="info-row">
        <div class="info-label">Email:</div>
        <div class="info-value"><a href="mailto:${esc(request.email)}">${esc(request.email)}</a></div>
      </div>
      <div class="info-row">
        <div class="info-label">Phone:</div>
        <div class="info-value"><a href="tel:${esc(request.phone)}">${esc(request.phone)}</a></div>
      </div>
    </div>

    <div class="info-card">
      <h2 style="margin-top: 0; color: #FACC15;">Business Details</h2>
      <div class="info-row">
        <div class="info-label">Business Name:</div>
        <div class="info-value"><strong>${esc(request.businessName)}</strong></div>
      </div>
      <div class="info-row">
        <div class="info-label">Business Type:</div>
        <div class="info-value">${esc(request.businessType)}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Company Size:</div>
        <div class="info-value">${esc(request.companySize)}</div>
      </div>
    </div>

    <div class="features">
      <h3 style="margin-top: 0;">Required Features:</h3>
      <ul>
        ${JSON.parse(request.requiredFeatures).map((feature: string) => `<li>${esc(feature)}</li>`).join('')}
      </ul>
    </div>

    ${request.additionalNotes ? `
      <div class="info-card">
        <h3 style="margin-top: 0;">Additional Notes:</h3>
        <p style="margin: 0; font-style: italic; color: #555;">&quot;${esc(request.additionalNotes)}&quot;</p>
      </div>
    ` : ''}

    <div class="info-card">
      <h3 style="margin-top: 0;">Preferred Meeting Date:</h3>
      <p style="margin: 0; font-size: 18px; color: #FACC15; font-weight: 600;">
        ${new Date(request.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
      </p>
      <p style="margin: 5px 0 0 0; color: #888; font-size: 14px;">
        Meeting will be scheduled at 7:00 PM (30 minutes)
      </p>
    </div>

    <div class="button-container">
      <a href="${approvalUrl}" class="button button-approve">
        ✓ Accept Meeting
      </a>
      <a href="${rejectionUrl}" class="button button-reject">
        ✗ Reject Request
      </a>
    </div>

    <p style="text-align: center; color: #888; font-size: 14px; margin-top: 20px;">
      Clicking a button above will automatically process the request and notify the client.
    </p>
  </div>

  <div class="footer">
    <p>This is an automated notification from AnserTech Meeting System</p>
    <p>Request ID: ${request.id}</p>
  </div>
</body>
</html>
  `;
}

export function getUserConfirmationEmail(request: MeetingRequest): string {
    const meetingDate = new Date(request.selectedDate);
    meetingDate.setHours(19, 0, 0, 0); // 7 PM

    const formattedDate = meetingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate calendar links
    const calendarTitle = encodeURIComponent('Meeting with AnserTech');
    const calendarDescription = encodeURIComponent('Discovery call to discuss your business needs and AI solutions.');
    const startTime = meetingDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(meetingDate.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${startTime}/${endTime}&details=${calendarDescription}&sf=true&output=xml`;

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 40px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .checkmark {
      font-size: 64px;
      margin-bottom: 10px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 12px 12px;
    }
    .meeting-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      margin: 20px 0;
      border: 2px solid #FACC15;
      text-align: center;
    }
    .meeting-time {
      font-size: 24px;
      color: #FACC15;
      font-weight: 700;
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 30px;
      background: #FACC15;
      color: #000;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .info-box {
      background: #dbeafe;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #3b82f6;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="checkmark">✓</div>
    <h1 style="margin: 0; font-size: 32px;">Meeting Confirmed!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your meeting with AnserTech is scheduled</p>
  </div>
  
  <div class="content">
    <p style="font-size: 18px; text-align: center;">
      Hi <strong>${request.fullName}</strong>, great news! 🎉
    </p>
    
    <p style="text-align: center; color: #555;">
      Your meeting request has been approved. We're excited to discuss how AnserTech can help <strong>${request.businessName}</strong> grow with AI-powered solutions.
    </p>

    <div class="meeting-card">
      <h2 style="margin-top: 0; color: #333;">Meeting Details</h2>
      <div class="meeting-time">
        📅 ${formattedDate}
        <br>
        🕖 7:00 PM - 7:30 PM
      </div>
      <p style="color: #666; margin: 10px 0;">Duration: 30 minutes</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${googleCalendarUrl}" class="button">
        📅 Add to Google Calendar
      </a>
    </div>

    <div class="info-box">
      <h3 style="margin-top: 0;">What to Expect:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Introduction and understanding your business goals</li>
        <li>Discussion of your requirements: ${JSON.parse(request.requiredFeatures).slice(0, 2).join(', ')}</li>
        <li>Custom solution proposal and pricing</li>
        <li>Q&A session</li>
      </ul>
    </div>

    <div class="info-box" style="background: #fef3c7; border-left-color: #FACC15;">
      <h3 style="margin-top: 0;">Before the Meeting:</h3>
      <p style="margin: 5px 0;">✓ We'll send you a meeting link closer to the date</p>
      <p style="margin: 5px 0;">✓ Prepare any questions you'd like to discuss</p>
      <p style="margin: 5px 0;">✓ We'll reach out if we need any additional information</p>
    </div>

    <p style="text-align: center; margin-top: 30px;">
      If you need to reschedule or have any questions, reply to this email.
    </p>
  </div>

  <div class="footer">
    <p><strong>AnserTech</strong></p>
    <p>AI-Powered Business Solutions</p>
    <p style="margin-top: 15px; color: #aaa;">This email was sent to ${request.email}</p>
  </div>
</body>
</html>
  `;
}

export function getUserRejectionEmail(request: MeetingRequest): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
      padding: 40px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 12px 12px;
    }
    .info-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #FACC15;
    }
    .button {
      display: inline-block;
      padding: 14px 30px;
      background: #FACC15;
      color: #000;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px;">Meeting Request Update</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Regarding your meeting request</p>
  </div>
  
  <div class="content">
    <p style="font-size: 18px;">
      Hi <strong>${request.fullName}</strong>,
    </p>
    
    <p>
      Thank you for your interest in AnserTech and for taking the time to submit a meeting request for <strong>${request.businessName}</strong>.
    </p>

    <p>
      Unfortunately, we're unable to schedule a meeting at this time. This could be due to scheduling conflicts or other constraints.
    </p>

    <div class="info-box">
      <h3 style="margin-top: 0;">Alternative Options:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>You can submit a new request with different dates</li>
        <li>Reply to this email with your availability</li>
        <li>Visit our website for more information about our services</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/book-appointment" class="button">
        Submit New Request
      </a>
    </div>

    <p>
      We appreciate your understanding and hope to connect with you in the future.
    </p>
  </div>

  <div class="footer">
    <p><strong>AnserTech</strong></p>
    <p>AI-Powered Business Solutions</p>
    <p style="margin-top: 15px; color: #aaa;">This email was sent to ${request.email}</p>
  </div>
</body>
</html>
  `;
}
