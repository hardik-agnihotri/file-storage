import { useState } from 'react';
import axios from 'axios';
import { axiosClient } from '../api/axiosClient';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB Production Standard S3 Block Cut

export const useChunkUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadLargeFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    try {
      // 1. Handshake Phase via our Clean Client
      const initResponse = await axiosClient.post('/files/multipart/initiate', {
        name: file.name,
        totalChunks,
      });

      const { uploadId, storageKey, chunks } = initResponse.data;
      const uploadedParts = [];

      // 2. Optimized Slicing Pipeline
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        const chunkMetadata = chunks[i];

        // Direct stream call straight to MinIO Container using a clean standard axios instance
        const uploadResponse = await axios.put(chunkMetadata.url, chunkBlob, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (e) => {
            if (e.total) {
              const totalLoadedAcrossFile = start + e.loaded;
              setProgress(Math.min(Math.round((totalLoadedAcrossFile / file.size) * 100), 99));
            }
          },
        });

        const eTag = uploadResponse.headers['etag'];
        uploadedParts.push({
          ETag: eTag.replace(/"/g, ''),
          PartNumber: chunkMetadata.partNumber,
        });
      }

      // 3. Assembly Handshake Phase
      const completeResponse = await axiosClient.post('/files/multipart/complete', {
        name: file.name,
        mimeType: file.type,
        storageKey,
        uploadId,
        parts: uploadedParts,
      });

      setProgress(100);
      setTimeout(() => setIsUploading(false), 800);
      return completeResponse.data;
    } catch (error) {
      setIsUploading(false);
      setProgress(0);
      throw error;
    }
  };

  return { uploadLargeFile, isUploading, progress };
};