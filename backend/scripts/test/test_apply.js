const mongoose = require('mongoose');
const { applyForJob } = require('../src/controllers/applicationController');
const Employer = require('../src/models/Employer');
const Job = require('../src/models/Job');
const Applicant = require('../src/models/Applicant');
const Application = require('../src/models/Application');

async function test() {
  await mongoose.connect('mongodb+srv://justeenasanty872_db_user:Justeena2005@shiftmatch.jhoepl2.mongodb.net/?appName=ShiftMatch');
  console.log('Connected to DB');

  const job = await Job.findOne();
  if (!job) {
    console.log('No job found');
    process.exit(1);
  }
  
  const applicant = await Applicant.findOne();
  if(!applicant) {
     console.log('No applicant found');
     process.exit(1);
  }

  // Delete existing application just in case
  await Application.deleteOne({ job: job._id, applicant: applicant._id });

  const req = {
    params: { jobId: job._id.toString() },
    body: { coverLetter: 'Hello', expectedSalary: 1000 },
    user: applicant
  };

  const res = {
    statusCode: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log('JSON Output:', this.statusCode, JSON.stringify(data, null, 2));
    }
  };

  try {
    await applyForJob(req, res);
  } catch (err) {
    console.error('Error thrown:', err);
  }
  process.exit(0);
}
test();
