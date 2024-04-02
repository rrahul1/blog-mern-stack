import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);

export default router;
