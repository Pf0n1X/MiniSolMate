import { Router } from "express";
import { addMatch, getMatchesById } from "../controllers/matchController";

const router = Router();
router.post("/", addMatch);
router.get("/", getMatchesById);

export default router;
