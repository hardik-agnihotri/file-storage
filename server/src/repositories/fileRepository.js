import { File } from '../models/File.js';
import { FileVersion } from '../models/FileVersion.js';

export const fileRepository = {
  async createAndLinkFile({ name, folderId, ownerId, mimeType, storageKey, sizeInBytes }) {
    const newFile = new File({
      name,
      folderId,
      ownerId,
      mimeType,
    });

    const newVersion = new FileVersion({
      fileId: newFile._id,
      versionNumber: 1, 
      storageKey,
      sizeInBytes,
      uploadedBy: ownerId,
    });

    await newVersion.save();
    
   
    newFile.currentVersionId = newVersion._id;
    await newFile.save();

    return { file: newFile, version: newVersion };
  },

  async findFileById(fileId) {
    return File.findById(fileId).populate('currentVersionId');
  }
};