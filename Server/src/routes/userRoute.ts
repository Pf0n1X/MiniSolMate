import { Router } from "express";
import { addUser, getUserById } from "../controllers/userController";

const router = Router();
router.post("/", addUser);
router.get("/", getUserById);

export default router;
