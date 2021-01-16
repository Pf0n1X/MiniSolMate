import { Router } from "express";
import { addMsg } from "../controllers/messageController";

const router = Router();
router.post("/", addMsg);

export default router;
