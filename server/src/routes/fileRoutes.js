import {Router} from "express";
import multer from "multer";


const router = Router();
const upload = multer({storage:multer.memoryStorage()});

router.post('/upload-single', upload.single('file'), fileController.uploadSingle);
router.post('/multipart/initiate', fileController.initiateMultipart);
router.post('/multipart/complete', fileController.completeMultipart);

router.post("/upload-single",)