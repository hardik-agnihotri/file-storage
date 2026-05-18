import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

folderSchema.index({ parentFolderId: 1, ownerId: 1 });
folderSchema.index(
  { name: 1, parentFolderId: 1, ownerId: 1 },
  { unique: true },
);

export const Folder = mongoose.model("Folder", folderSchema);
