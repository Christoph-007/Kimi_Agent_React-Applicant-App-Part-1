const axios = require('axios');
const mongoose = require('mongoose');

async function test() {
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    identifier: 'grandbakery@example.com',
    password: 'password123',
    userType: 'employer'
  });
  const token = loginRes.data.token;
  
  // Find a job
  const jobRes = await axios.get('http://localhost:5000/api/jobs');
  const job = jobRes.data.data[0];
  
  console.log('Testing job ID:', job._id);
  
  try {
    const appsRes = await axios.get(`http://localhost:5000/api/applications/job/${job._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', appsRes.data);
  } catch (err) {
    console.log('Failed:', err.response?.status, err.response?.data);
  }
}
test().catch(console.error);
