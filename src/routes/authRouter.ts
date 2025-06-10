import express, { Router } from "express";
import { forgotPassword, login, postVerifyResetToken, register, resetPassword } from "../controller/authController";

// Create router
const router: Router = express.Router();

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

// forgot password route
router.post("/forgot-password", forgotPassword);

// verify token route
router.post("/verify-token", postVerifyResetToken);

router.post("/reset-token", resetPassword);


export default router;