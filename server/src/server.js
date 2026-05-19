import app from './app.js';
import { connectDatabase } from './config/db.js';
import { s3Client, BUCKET_NAME } from './config/s3Client.js';
import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrapObjectStorage() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(` MinIO Storage Pool "${BUCKET_NAME}" ready.`);
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(` MinIO Storage Pool "${BUCKET_NAME}" generated dynamically.`);
    } else {
      console.error(' Object storage infrastructure unreachable:', error.message);
    }
  }
}

async function startServer() {
  await connectDatabase();
  
  await bootstrapObjectStorage();

  app.listen(PORT, () => {
    console.log(`Production Server listening on http://localhost:${PORT}`);
  });
}

startServer();