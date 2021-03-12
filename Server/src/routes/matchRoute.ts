import { Router } from "express";
import { addMatch, getMatchesById, updateMatch } from "../controllers/matchController";
import { authenticateJWT } from "../controllers/authController";

const router = Router();
router.use(authenticateJWT);
router.post("/", addMatch);
router.get("/", getMatchesById);
router.put("/", updateMatch);

export default router;
