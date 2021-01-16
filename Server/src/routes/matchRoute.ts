import { Router } from "express";
import { addMatch } from "../controllers/matchController";

const router = Router();
router.post("/", addMatch);

export default router;
