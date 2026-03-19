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

// Email template for admin - New employer signup
const adminNewEmployerTemplate = (employer) => {
  return {
    subject: 'NEW EMPLOYER REGISTRATION - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #333; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>New Employer Signup</h1></div>
          <div class="content">
            <p>A new employer has registered and is waiting for approval:</p>
            <ul>
              <li><strong>Store Name:</strong> ${employer.storeName}</li>
              <li><strong>Owner Name:</strong> ${employer.ownerName}</li>
              <li><strong>Email:</strong> ${employer.email}</li>
              <li><strong>Phone:</strong> ${employer.phone}</li>
              <li><strong>Business Type:</strong> ${employer.businessType}</li>
            </ul>
            <p>Please review local details and approve/reject in the admin dashboard.</p>
            <a href="${process.env.FRONTEND_URL}/admin/employers" class="button">Go to Admin Dashboard</a>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch Admin System.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `New Employer Registration: ${employer.storeName}\nOwner: ${employer.ownerName}\nEmail: ${employer.email}\nPhone: ${employer.phone}\nPlease review in admin dashboard.`,
  };
};

// Email template for employer - New application received
const employerNewApplicationTemplate = (employerName, applicantName, jobTitle) => {
  return {
    subject: `New Application Received: ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>New Application!</h1></div>
          <div class="content">
            <h2>Hello ${employerName},</h2>
            <p>You have received a new application for your job posting: <strong>${jobTitle}</strong>.</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p>Please log in to your dashboard to review the application and candidate details.</p>
            <a href="${process.env.FRONTEND_URL}/employer/applications" class="button">View Application</a>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `New Application: ${applicantName} applied for ${jobTitle}.\n\nPlease review it in your dashboard.`,
  };
};

// Email template for applicant - Account activated
const applicantActivationTemplate = (applicantName) => {
  return {
    subject: 'Your ShiftMatch Account is Now Active!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Your Account is Active!</h1></div>
          <div class="content">
            <h2>Hello ${applicantName},</h2>
            <p>We are pleased to inform you that your ShiftMatch account has been fully activated.</p>
            <p>You can now browse and apply for jobs, receive shift offers, and manage your work schedule.</p>
            <a href="${process.env.FRONTEND_URL}/jobs" class="button">Find Jobs Now</a>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${applicantName},\n\nYour ShiftMatch account is now active! You can now start applying for jobs and earning.\n\nGood luck!`,
  };
};

// Email template for employer - Account blocked
const employerBlockedTemplate = (ownerName, storeName) => {
  return {
    subject: `Action Required: Your ShiftMatch Employer Account has been suspended`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Account Suspended</h1></div>
          <div class="content">
            <h2>Hello ${ownerName},</h2>
            <p>Your employer account for <strong>${storeName}</strong> has been suspended by an administrator.</p>
            <p>You will no longer be able to post jobs, manage applications, or access your dashboard. If you believe this was a mistake, please contact our support team immediately.</p>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Your ShiftMatch employer account for ${storeName} has been suspended by an admin. Contact support if this is a mistake.`,
  };
};

// Email template for employer - Account unblocked
const employerUnblockedTemplate = (ownerName, storeName) => {
  return {
    subject: `Great News! Your ShiftMatch Employer Account corresponds to restored access`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Account Restored</h1></div>
          <div class="content">
            <h2>Hello ${ownerName},</h2>
            <p>Your employer account for <strong>${storeName}</strong> has been fully restored and unblocked by an administrator.</p>
            <p>You can now log back into the portal and resume managing your jobs and applications.</p>
            <a href="${process.env.FRONTEND_URL}/login" class="button">Log In Now</a>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Your ShiftMatch employer account for ${storeName} has been restored and unblocked by an admin. You can now log in.`,
  };
};

// Email template for applicant - Account deactivated
const applicantDeactivatedTemplate = (name) => {
  return {
    subject: `Notice: Your ShiftMatch Applicant Account has been deactivated`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Account Deactivated</h1></div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Your applicant account on ShiftMatch has been deactivated by an administrator.</p>
            <p>You will no longer be able to apply for jobs or view your shifts. If you believe this is a mistake, please reach out to the our support team.</p>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Your applicant account on ShiftMatch has been deactivated by an administrator. Please reach out to support for more details.`,
  };
};

// Email template for employer - Job Deleted by Admin
const employerJobDeletedTemplate = (ownerName, jobTitle) => {
  return {
    subject: `Notice: Your job posting "${jobTitle}" has been removed`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Job Posting Removed</h1></div>
          <div class="content">
            <h2>Hello ${ownerName},</h2>
            <p>Your job posting for <strong>"${jobTitle}"</strong> has been removed from ShiftMatch by an administrator.</p>
            <p>This action usually occurs if a job posting violates our terms of service or requires content moderation.</p>
            <p>If you believe this was a mistake or need further details, please reach out to our support team.</p>
          </div>
          <div class="footer"><p>&copy; 2026 ShiftMatch. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Your job posting for "${jobTitle}" has been removed from ShiftMatch by an administrator. Please reach out to support if you have questions.`,
  };
};

module.exports = {
  employerSignupTemplate,
  employerApprovalTemplate,
  applicantSignupTemplate,
  applicationStatusTemplate,
  shiftAssignmentTemplate,
  forgotPasswordTemplate,
  adminNewEmployerTemplate,
  employerNewApplicationTemplate,
  applicantActivationTemplate,
  employerBlockedTemplate,
  employerUnblockedTemplate,
  applicantDeactivatedTemplate,
  employerJobDeletedTemplate,
};
