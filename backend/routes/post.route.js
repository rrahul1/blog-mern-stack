import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, getPosts } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getPosts);

export default router;
