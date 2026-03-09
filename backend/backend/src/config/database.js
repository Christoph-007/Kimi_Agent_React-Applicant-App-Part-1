const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check:');
    console.error('1. MongoDB URI is correct in .env file');
    console.error('2. Your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Network connection is stable');
    console.error('4. MongoDB cluster is running');
    process.exit(1);
  }
};

module.exports = connectDatabase;
