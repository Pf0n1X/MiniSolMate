import { Router } from "express";
import { addUser, getUserById, login } from "../controllers/userController";

const router = Router();
router.post("/login", login)
router.post("/", addUser);
router.get("/", getUserById);

export default router;
