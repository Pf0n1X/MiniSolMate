import { Router } from "express";
import {authenticateUser,registerUser}  from "../controllers/userController";

const router = Router();
router.post("/login", authenticateUser)
router.post("/register", registerUser);
// router.get("/", getUserById);

export default router;
