const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('\n⚠️  MongoDB Connection Failed!');
    console.error('Please ensure MongoDB is running locally:');
    console.error('1. Download MongoDB Community: https://www.mongodb.com/try/download/community');
    console.error('2. Install and start MongoDB');
    console.error('3. Restart this server');
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;