import { Router } from "express";
import { addMsg, getMessagesById } from "../controllers/messageController";

const router = Router();
router.post("/", addMsg);
router.get("/", getMessagesById);

export default router;
