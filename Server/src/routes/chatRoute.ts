import { Router } from "express";
import { addChat, getChatsByUser, updateChat, deleteChat } from "../controllers/chatController";

const router = Router();
router.post("/", addChat);
router.get("/", getChatsByUser);
router.put("/", updateChat);
router.delete("/", deleteChat);


export default router;
