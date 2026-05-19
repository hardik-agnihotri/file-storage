import mongoose from "mongoose";
import { storageService } from "../services/storageService.js"

export const fileController = {
    async uploadSingle(req, res) {
        try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const mockOwnerId = new mongoose.Types.ObjectId("65f1c9a8b3d6c123456789ab"); 

        const result = await storageService.uploadSingleFile({
            name: req.file.originalname,
            folderId: req.body.folderId || null,
            ownerId: mockOwnerId,
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
}