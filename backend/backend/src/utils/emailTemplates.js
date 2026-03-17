// Email template for employer signup (pending approval)
const employerSignupTemplate = (employerName, storeName) => {
  return {
    subject: 'Welcome to ShiftMatch - Account Pending Approval',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ShiftMatch!</h1>
          </div>
          <div class="content">
            <h2>Hello ${employerName},</h2>
            <p>Thank you for registering <strong>${storeName}</strong> on ShiftMatch!</p>
            <p>Your account is currently <strong>pending approval</strong> by our admin team. You will receive another email once your account has been approved.</p>
            <p>Once approved, you'll be able to:</p>
            <ul>
              <li>Post job openings</li>
              <li>Manage applications</li>
              <li>Create and manage shifts</li>
              <li>Track attendance</li>
            </ul>
            <p>This usually takes 24-48 hours. Thank you for your patience!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to ShiftMatch!\n\nHello ${employerName},\n\nThank you for registering ${storeName} on ShiftMatch! Your account is currently pending approval by our admin team. You will receive another email once your account has been approved.\n\nThis usually takes 24-48 hours. Thank you for your patience!`,
  };
};

// Email template for employer approval
const employerApprovalTemplate = (employerName, storeName) => {
  return {
    subject: 'Your ShiftMatch Account Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Approved!</h1>
          </div>
          <div class="content">
            <h2>Congratulations ${employerName}!</h2>
            <p>Your ShiftMatch account for <strong>${storeName}</strong> has been approved!</p>
            <p>You can now:</p>
            <ul>
              <li>Post unlimited job openings</li>
              <li>Review and manage applications</li>
              <li>Create shifts for your employees</li>
              <li>Track attendance and manage your workforce</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/employer/dashboard" class="button">Go to Dashboard</a>
            <p>Thank you for choosing ShiftMatch!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${employerName}!\n\nYour ShiftMatch account for ${storeName} has been approved! You can now post jobs, manage applications, create shifts, and track attendance.\n\nThank you for choosing ShiftMatch!`,
  };
};

// Email template for applicant signup
const applicantSignupTemplate = (applicantName) => {
  return {
    subject: 'Welcome to ShiftMatch!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ShiftMatch!</h1>
          </div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>Thank you for joining ShiftMatch!</p>
            <p>You can now:</p>
            <ul>
              <li>Browse thousands of job opportunities</li>
              <li>Apply for jobs that match your skills</li>
              <li>Manage your shifts</li>
              <li>Track your attendance and earnings</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/jobs" class="button">Browse Jobs</a>
            <p>Good luck with your job search!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to ShiftMatch!\n\nHello ${applicantName},\n\nThank you for joining ShiftMatch! You can now browse jobs, apply for positions, manage shifts, and track your attendance.\n\nGood luck with your job search!`,
  };
};

// Email template for application status update
const applicationStatusTemplate = (applicantName, jobTitle, status, employerName) => {
  const statusMessages = {
    accepted: {
      subject: 'Application Accepted!',
      message: 'Congratulations! Your application has been accepted.',
      color: '#4CAF50',
    },
    rejected: {
      subject: 'Application Update',
      message: 'Unfortunately, your application was not selected at this time.',
      color: '#F44336',
    },
    reviewing: {
      subject: 'Application Under Review',
      message: 'Your application is currently being reviewed.',
      color: '#FF9800',
    },
  };

  const statusInfo = statusMessages[status] || statusMessages.reviewing;

  return {
    subject: statusInfo.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${statusInfo.color}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.subject}</h1>
          </div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>${statusInfo.message}</p>
            <p><strong>Job:</strong> ${jobTitle}</p>
            <p><strong>Employer:</strong> ${employerName}</p>
            ${status === 'accepted' ? '<p>The employer will contact you soon with next steps.</p>' : ''}
            ${status === 'rejected' ? '<p>Keep applying! There are many other opportunities waiting for you.</p>' : ''}
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${statusInfo.subject}\n\nHello ${applicantName},\n\n${statusInfo.message}\n\nJob: ${jobTitle}\nEmployer: ${employerName}`,
  };
};

// Email template for shift assignment
const shiftAssignmentTemplate = (applicantName, jobTitle, shiftDate, startTime, endTime, location) => {
  return {
    subject: 'New Shift Assigned',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .shift-details { background-color: white; padding: 15px; border-left: 4px solid #9C27B0; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Shift Assigned</h1>
          </div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>You have been assigned a new shift!</p>
            <div class="shift-details">
              <p><strong>Job:</strong> ${jobTitle}</p>
              <p><strong>Date:</strong> ${new Date(shiftDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
              <p><strong>Location:</strong> ${location}</p>
            </div>
            <p>Please confirm your availability for this shift.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Shift Assigned\n\nHello ${applicantName},\n\nYou have been assigned a new shift!\n\nJob: ${jobTitle}\nDate: ${new Date(shiftDate).toLocaleDateString()}\nTime: ${startTime} - ${endTime}\nLocation: ${location}\n\nPlease confirm your availability for this shift.`,
  };
};

// Email template for password reset
const forgotPasswordTemplate = (userName, resetUrl) => {
  return {
    subject: 'ShiftMatch - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
            <p>Please click on the button below to complete the process within the next 10 minutes:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 ShiftMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Password Reset Request\n\nHello ${userName},\n\nYou are receiving this email because you (or someone else) have requested the reset of a password. Please click on the link below to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
  };
};

module.exports = {
  employerSignupTemplate,
  employerApprovalTemplate,
  applicantSignupTemplate,
  applicationStatusTemplate,
  shiftAssignmentTemplate,
  forgotPasswordTemplate,
};
