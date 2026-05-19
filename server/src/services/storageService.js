import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { s3Client, BUCKET_NAME } from '../config/s3Client.js';
import { fileRepository } from '../repositories/fileRepository.js';

export const storageService = {
  async uploadSingleFile({ name, folderId, ownerId, mimeType, buffer, sizeInBytes }) {
    const uniqueHash = crypto.randomUUID();
    const storageKey = `${ownerId}/${uniqueHash}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: storageKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(uploadCommand);

    const dataRecords = await fileRepository.createAndLinkFile({
      name,
      folderId,
      ownerId,
      mimeType,
      storageKey,
      sizeInBytes,
    });

    return dataRecords;
  }
};