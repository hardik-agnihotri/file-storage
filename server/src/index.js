import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from './config/s3Client.js';
import { storageService } from './services/storageService.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Keep buffer in memory for single-file stage

app.use(express.json());

async function bootstrapStorage() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`MinIO Bucket "${BUCKET_NAME}" confirmed active.`);
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`MinIO Bucket "${BUCKET_NAME}" initialized for the first time.`);
    } else {
      console.error('Object storage connection issue:', error);
    }
  }
}


app.post('/api/v1/files/upload-single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const mockOwnerId = new mongoose.Types.ObjectId(); 

    const result = await storageService.uploadSingleFile({
      name: req.file.originalname,
      folderId: req.body.folderId || null,
      ownerId: mockOwnerId,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
      sizeInBytes: req.file.size,
    });

    res.status(201).json({ message: 'Upload success', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const MONGO_URI = 'mongodb://db_admin:db_secure_password123@localhost:27017/cloud_drive?authSource=admin';
const PORT = 5000;

mongoose.connect(MONGO_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  await bootstrapStorage();
  app.listen(PORT, () => console.log(`Gateway Server active on port ${PORT}`));
});