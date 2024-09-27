import express from "express";
import { login, signup, forget, resetPassword } from "../controllers/authControllers.mjs";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget", forget);
router.get("/ResetPassword", resetPassword) ;



export default router;
