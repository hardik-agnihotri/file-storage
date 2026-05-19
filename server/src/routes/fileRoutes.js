import {Router} from "express";
import multer from "multer";
import { protect } from '../middlewares/authMiddleware.js';
import { fileController } from "../controllers/fileController.js";


const router = Router();
const upload = multer({storage:multer.memoryStorage()});
router.use(protect);
router.post('/upload-single', upload.single('file'), fileController.uploadSingle);
// router.post('/multipart/initiate', fileController.initiateMultipart);
// router.post('/multipart/complete', fileController.completeMultipart);


export default router