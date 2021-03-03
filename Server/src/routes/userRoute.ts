import { Router } from "express";
import {authenticateUser,registerUser}  from "../controllers/userController";

const router = Router();
router.post("/login", authenticateUser)
router.post("/register", async (req, res, next) => {
    try {
    //listing messages in users mailbox 
    registerUser (req, res)
    } catch (err) {
      next(err);
    }
  });
// router.get("/", getUserById);

export default router;
