export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface PresignedChunkMetadata {
  url: string;
  partNumber: number;
}

export interface MultipartInitResponse {
  uploadId: string;
  storageKey: string;
  chunks: PresignedChunkMetadata[];
}

export interface CompletedPartPayload {
  ETag: string;
  PartNumber: number;
}

export interface FileMetadataRecord {
  _id: string;
  name: string;
  folderId: string | null;
  ownerId: string;
  mimeType: string;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultipartCompleteResponse {
  message: string;
  data: {
    file: FileMetadataRecord;
  };
}