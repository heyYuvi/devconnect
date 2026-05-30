import express from "express";
import { createPost, deletePost, feed, globalFeed, singlePost, toggleLike } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/post/create", protect, createPost);
router.get("/post/get-single-post/:id", protect, singlePost);
router.delete("/post/delete/:id", protect, deletePost);
router.get("/global-feed", protect, globalFeed);
router.get("/feed", protect, feed);
router.put("/toogle-like/:id", protect, toggleLike);

export default router; 