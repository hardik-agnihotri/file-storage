import mongoose from "mongoose";
import { storageService } from "../services/storageService.js"

export const fileController = {
    async uploadSingle(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const activeUserId = req.user._id; 

        const result = await storageService.uploadSingleFile({
        name: req.file.originalname,
        folderId: req.body.folderId || null,
        ownerId: activeUserId, // <-- Passed dynamically
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
        sizeInBytes: req.file.size,
        });

        return res.status(201).json({ message: 'Upload success', data: result });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    },
async initiateMultipart(req, res) {
    try {
      const { name, totalChunks } = req.body;
      if (!name || !totalChunks) {
        return res.status(400).json({ error: 'Missing name or totalChunks parameters' });
      }

    const activeUserId = req.user._id; 
      const session = await storageService.initiateMultipart({ name, ownerId: activeUserId });
      
      const chunkUrls = await storageService.generatePresignedUrlsForChunks({
        storageKey: session.storageKey,
        uploadId: session.uploadId,
        totalChunks: parseInt(totalChunks),
      });

      return res.status(200).json({
        uploadId: session.uploadId,
        storageKey: session.storageKey,
        chunks: chunkUrls,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to initialize upload architecture' });
    }
  },

  async completeMultipart(req, res) {
    try {
      const { name, folderId, mimeType, storageKey, uploadId, parts } = req.body;
      const activeUserId = req.user._id; 
      const result = await storageService.completeMultipart({
        name,
        folderId: folderId || null,
        ownerId: activeUserId,
        mimeType,
        storageKey,
        uploadId,
        parts,
      });

      return res.status(201).json({ message: 'Large asset successfully assembled', data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Chunk stitching execution failed' });
    }
  }
};