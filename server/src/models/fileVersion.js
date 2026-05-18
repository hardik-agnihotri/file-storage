import mongoose from 'mongoose';

const fileVersionSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    sizeInBytes: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

fileVersionSchema.index({ fileId: 1, versionNumber: -1 });

export const FileVersion = mongoose.model('FileVersion', fileVersionSchema);