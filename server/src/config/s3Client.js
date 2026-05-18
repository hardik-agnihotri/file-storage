import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// We point the client directly to our local Docker MinIO container
export const s3Client = new S3Client({
  region: 'us-east-1', // Required by SDK, can be a dummy value for local MinIO
  endpoint: 'http://localhost:9000', // Docker mapped port
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || 'drive_admin',
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'drive_secure_password123',
  },
  forcePathStyle: true, 
});

export const BUCKET_NAME = 'user-drive-assets';