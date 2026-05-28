import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);

export default router;