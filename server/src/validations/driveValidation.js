import { z } from 'zod';

// MongoDB ObjectId validation regex helper
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const zObjectId = z.string().regex(objectIdRegex, { message: 'Invalid unique ID format' });

export const createFolderSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Folder name cannot be empty')
      .max(255, 'Folder name is too long')
      .regex(/^[^\\/?%*:|"<>\.]+$/, 'Folder name contains illegal characters'),
    parentFolderId: zObjectId.nullable().optional().default(null),
  }),
});

export const initiateUploadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'File name is required').max(255),
    folderId: zObjectId.nullable().optional().default(null),
    mimeType: z.string().min(1, 'Mime type is required'),
    sizeInBytes: z.number().positive('File size must be greater than 0'),
  }),
});