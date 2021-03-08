import { Router } from "express";
import { addMatch, getMatchesById, updateMatch } from "../controllers/matchController";

const router = Router();
router.post("/", addMatch);
router.get("/", getMatchesById);
router.put("/", updateMatch);

export default router;
