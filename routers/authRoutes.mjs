import express from "express";
import { login, signup, forget, resetPassword, sendFeedback } from "../controllers/authControllers.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget", forget);
router.get("/ResetPassword", resetPassword) ;
router.post("/feedback", sendFeedback) ;



export default router;
