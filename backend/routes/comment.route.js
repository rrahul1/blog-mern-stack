import express from "express";
import {
   createComment,
   getPostComment,
   likeComment,
} from "../controller/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", getPostComment);
router.put("/likecomment/:commentId", verifyToken, likeComment);

export default router;
