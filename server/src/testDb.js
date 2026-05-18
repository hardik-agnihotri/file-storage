import mongoose from 'mongoose';
import { Folder } from './models/Folder.js';
import { File } from './models/File.js';
import { FileVersion } from './models/FileVersion.js';

const MONGO_URI = 'mongodb://db_admin:db_secure_password123@localhost:27017/cloud_drive?authSource=admin';

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Database Schema Layer Compiled and Connected Successfully!');
    
    // Output our current collection configurations
    console.log('Registered Models:', mongoose.modelNames());
  } catch (error) {
    console.error('❌ Schema compilation failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();