import express from "express";
import { upload_pdf, delete_pdf,getUserPdfs } from "../controllers/insurenceController.mjs";

const router = express.Router();

router.post("/get_pdf", getUserPdfs);
router.post("/upload_pdf", upload_pdf);
router.delete("/delete_pdf", delete_pdf);

export default router;