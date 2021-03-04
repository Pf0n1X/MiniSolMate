import { Router } from "express";
import { addChat, getChatsByUser, updateChat } from "../controllers/chatController";

const router = Router();
router.post("/", addChat);
router.get("/", getChatsByUser);
router.put("/", updateChat);

export default router;
