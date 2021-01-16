import { Router } from "express";
import { addChat } from "../controllers/chatController";

const router = Router();
router.post("/", addChat);

export default router;
