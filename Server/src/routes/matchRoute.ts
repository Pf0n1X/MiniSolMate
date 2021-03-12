import { Router } from "express";
import { addMatch, getMatchesById, updateMatch, calcMatchesForUser } from "../controllers/matchController";

const router = Router();
router.post("/", addMatch);
router.post("/calc/", calcMatchesForUser);
router.get("/", getMatchesById);
router.put("/", updateMatch);

export default router;
