import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://db_admin:db_secure_password123@localhost:27017/cloud_drive?authSource=admin';
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas via Clean Layer');
  } catch (error) {
    console.error('❌ MongoDB Connection Failure:', error.message);
    process.exit(1); // Crash gracefully if infrastructure is down
  }
};