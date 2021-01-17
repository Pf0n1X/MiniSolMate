import { Router } from "express";
import { addChat, getChatsByUser } from "../controllers/chatController";

const router = Router();
router.post("/", addChat);
router.get("/", getChatsByUser);

export default router;
