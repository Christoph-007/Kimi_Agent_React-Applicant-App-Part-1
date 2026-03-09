/**
 * newEmailTemplates.js
 * NEW email templates for the new employer-facing features.
 * Does NOT modify or replace the existing emailTemplates.js.
 */

// ─── Applicant: Job Request Received ─────────────────────────────────────────
const jobRequestReceivedTemplate = (
    applicantName,
    employerName,
    jobTitle,
    shiftType,
    location,
    offeredHourlyRate,
    message
) => ({
    subject: `Job Request from ${employerName} — ${jobTitle}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1565C0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .detail-box { background: white; border-left: 4px solid #1565C0; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>📋 New Job Request</h1></div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p><strong>${employerName}</strong> has sent you a job request!</p>
          <div class="detail-box">
            <p><strong>Job Title:</strong> ${jobTitle}</p>
            <p><strong>Shift Type:</strong> ${shiftType}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Offered Rate:</strong> ₹${offeredHourlyRate}/hr</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          <p>Log in to your account to accept or decline this request.</p>
        </div>
        <div class="footer"><p>&copy; 2026 ShiftMaster. All rights reserved.</p></div>
      </div>
    </body>
    </html>`,
    text: `Hello ${applicantName},\n\n${employerName} has sent you a job request for "${jobTitle}".\n\nShift Type: ${shiftType}\nLocation: ${location}\nOffered Rate: ₹${offeredHourlyRate}/hr\n${message ? `Message: ${message}\n` : ''}\nLog in to accept or decline.`,
});

// ─── Employer: Job Request Response ──────────────────────────────────────────
const jobRequestResponseTemplate = (
    employerName,
    applicantName,
    jobTitle,
    status
) => {
    const accepted = status === 'accepted';
    return {
        subject: `Job Request ${accepted ? 'Accepted' : 'Declined'} — ${jobTitle}`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${accepted ? '#2E7D32' : '#C62828'}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>${accepted ? '✅ Request Accepted!' : '❌ Request Declined'}</h1></div>
        <div class="content">
          <h2>Hello ${employerName},</h2>
          <p><strong>${applicantName}</strong> has <strong>${status}</strong> your job request for "<strong>${jobTitle}</strong>".</p>
          ${accepted ? '<p>You can now proceed to schedule a shift or contact the applicant directly.</p>' : '<p>You can continue browsing other available applicants on the platform.</p>'}
        </div>
        <div class="footer"><p>&copy; 2026 ShiftMaster. All rights reserved.</p></div>
      </div>
    </body>
    </html>`,
        text: `Hello ${employerName},\n\n${applicantName} has ${status} your job request for "${jobTitle}".\n\n${accepted ? 'You can now proceed to schedule a shift.' : 'You can browse other applicants on the platform.'}`,
    };
};

// ─── Applicant: Job Match Alert ───────────────────────────────────────────────
const jobMatchAlertTemplate = (
    applicantName,
    jobTitle,
    employerName,
    city,
    jobType,
    jobId
) => ({
    subject: `New Job Match: ${jobTitle} at ${employerName}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6A1B9A; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .detail-box { background: white; border-left: 4px solid #6A1B9A; padding: 15px; margin: 15px 0; }
        .button { display: inline-block; padding: 10px 20px; background-color: #6A1B9A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🎯 New Job Match!</h1></div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>A new job matching your interests has been posted!</p>
          <div class="detail-box">
            <p><strong>Job Title:</strong> ${jobTitle}</p>
            <p><strong>Employer:</strong> ${employerName}</p>
            <p><strong>Location:</strong> ${city}</p>
            <p><strong>Type:</strong> ${jobType}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/jobs/${jobId}" class="button">View Job</a>
        </div>
        <div class="footer"><p>&copy; 2026 ShiftMaster. All rights reserved.</p></div>
      </div>
    </body>
    </html>`,
    text: `Hello ${applicantName},\n\nA new job matching your interests has been posted!\n\nJob: ${jobTitle}\nEmployer: ${employerName}\nLocation: ${city}\nType: ${jobType}\n\nView it at: ${process.env.FRONTEND_URL}/jobs/${jobId}`,
});

// ─── Employer: New Matching Applicant ────────────────────────────────────────
const newMatchingApplicantTemplate = (
    employerName,
    applicantName,
    jobCategories,
    preferredWorkLocation
) => ({
    subject: `New Matching Applicant: ${applicantName}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #00695C; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .detail-box { background: white; border-left: 4px solid #00695C; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>👤 New Matching Applicant</h1></div>
        <div class="content">
          <h2>Hello ${employerName},</h2>
          <p>A new applicant matching your saved filters has joined ShiftMaster!</p>
          <div class="detail-box">
            <p><strong>Name:</strong> ${applicantName}</p>
            <p><strong>Interests:</strong> ${(jobCategories || []).join(', ') || 'Not specified'}</p>
            <p><strong>Preferred Location:</strong> ${preferredWorkLocation || 'Not specified'}</p>
          </div>
          <p>Log in to view their full profile and send a job request.</p>
        </div>
        <div class="footer"><p>&copy; 2026 ShiftMaster. All rights reserved.</p></div>
      </div>
    </body>
    </html>`,
    text: `Hello ${employerName},\n\nA new applicant matching your saved filters has joined!\n\nName: ${applicantName}\nInterests: ${(jobCategories || []).join(', ') || 'Not specified'}\nPreferred Location: ${preferredWorkLocation || 'Not specified'}\n\nLog in to view their profile.`,
});

module.exports = {
    jobRequestReceivedTemplate,
    jobRequestResponseTemplate,
    jobMatchAlertTemplate,
    newMatchingApplicantTemplate,
};
