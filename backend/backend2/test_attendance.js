const axios = require('axios');

async function testCheckIn() {
  try {
    const loginRes = await axios.post('http://localhost:5005/api/auth/login', {
      identifier: 'rahul.kumar@email.com',
      password: 'password123',
      userType: 'applicant'
    });
    
    console.log('Login Response Body:', JSON.stringify(loginRes.data, null, 2));
    
    if (!loginRes.data || !loginRes.data.data || !loginRes.data.data.token) {
        throw new Error('Login response missing token');
    }

    const token = loginRes.data.data.token;
    console.log('Logged in successfully, token received.');
    
    const shiftId = '69bab1f86c10e9e7112060f7';
    
    console.log('Testing Check-In for Shift:', shiftId);
    try {
      const checkInRes = await axios.post(`http://localhost:5005/api/attendance/${shiftId}/checkin`, {
        latitude: 0,
        longitude: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Check-In Success:', checkInRes.data);
    } catch (error) {
      console.error('Check-In Failed:', error.response?.data || error.message);
    }

    console.log('\nTesting Check-Out for Shift:', shiftId);
    try {
      const checkOutRes = await axios.post(`http://localhost:5005/api/attendance/${shiftId}/checkout`, {
        latitude: 0,
        longitude: 0,
        remarks: 'Test check-out'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Check-Out Success:', checkOutRes.data);
    } catch (error) {
      console.error('Check-Out Failed:', error.response?.data || error.message);
    }

  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCheckIn();
