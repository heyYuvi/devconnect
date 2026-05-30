import express from "express";
import { createPost, deletePost, feed, globalFeed, singlePost } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/post/create", protect, createPost);
router.get("/post/get-single-post/:id", protect, singlePost);
router.delete("/post/delete/:id", protect, deletePost);
router.get("/global-feed", protect, globalFeed);
router.get("/feed", protect, feed);

export default router; 