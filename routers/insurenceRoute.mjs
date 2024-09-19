import express from "express";

import {
  addInsurence,

  getInsurenceById,
  updateInsurenceById,

} from "../controllers/insurenceController.mjs";
import authMiddleware from "../middlewares/authMiddleware.mjs";

const router = express.Router();





router.get("/get-insurence", authMiddleware, getInsurenceById);
router.post("/add-insurence", authMiddleware, addInsurence);
router.put(
  "/update-insurence/:vehicleNumber",
  authMiddleware,
  updateInsurenceById
); //nill

// Route for PDF upload
router.post("/upload-pdf", async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body;
    const pdfPath = req.file.path;

    // Update the `pdf` field in the MongoDB document
    const insurance = await insurenceModel.findOneAndUpdate(
      { userId: userId },
      { pdf: pdfPath }, // Update the `pdf` field
      { new: true }
    );

    if (!insurance) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "PDF uploaded and linked successfully." });
  } catch (error) {
    console.error("Error in upload-pdf route:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export default router;
