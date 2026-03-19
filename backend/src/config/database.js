const mongoose = require('mongoose');

const connectDatabase = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('Please check:');
        console.error('1. MongoDB URI is correct in .env file');
        console.error('2. Your IP address is whitelisted in MongoDB Atlas');
        console.error('3. Network connection is stable');
        console.error('4. MongoDB cluster is running');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDatabase;
