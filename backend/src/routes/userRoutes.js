import express from "express";
import { profileCard, updateProfileCard } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/profilecard/:id", protect,profileCard);
router.put("/user/profilecard/:id", protect, updateProfileCard);

export default router;