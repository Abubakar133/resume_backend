import express from "express";
import {
  addInsurence,
  deleteInsurenceById,
  getInsurenceById,
  updateInsurenceById,
} from "../controllers/razainsuranceController.mjs";
import authMiddleware from "../middlewares/razaauthMiddleware.mjs";

const router = express.Router();

router.get("/get-insurence", authMiddleware, getInsurenceById);
router.post("/add-insurence", authMiddleware, addInsurence);
router.put(
  "/update-insurence/:vehicleNumber",
  authMiddleware,
  updateInsurenceById
);
router.delete("/delete-insurence", authMiddleware, deleteInsurenceById);

export default router;
