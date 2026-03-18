const mongoose = require('mongoose');
const { getJobApplications } = require('./src/controllers/applicationController');
const Employer = require('./src/models/Employer');
const Job = require('./src/models/Job');

async function test() {
  await mongoose.connect('mongodb+srv://justeenasanty872_db_user:Justeena2005@shiftmatch.jhoepl2.mongodb.net/?appName=ShiftMatch');
  console.log('Connected to DB');

  // Find a job
  const job = await Job.findOne();
  if (!job) {
    console.log('No job found');
    process.exit(1);
  }

  const employer = await Employer.findById(job.employer);
  if (!employer) {
    console.log('No employer found for job');
    process.exit(1);
  }

  const req = {
    params: { jobId: job._id.toString() },
    query: { page: 1, limit: 10 },
    user: { _id: employer._id }
  };

  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log('JSON Output:', this.statusCode, JSON.stringify(data, null, 2));
    }
  };

  try {
    await getJobApplications(req, res);
  } catch (err) {
    console.error('Error thrown:', err);
  }
  process.exit(0);
}
test();
