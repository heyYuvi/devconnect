import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/comment/create/:id", protect, createComment);
router.delete("/comment/delete/:id", protect, deleteComment);

export default router;