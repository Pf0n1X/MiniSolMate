import {
  authenticateUser,
  registerUser,
  uploadMedia,
  uploadProfile,
  getUserByEmail,
  updateUser,
} from "../controllers/userController";
import { response, Router } from "express";
import multer from "multer";
import * as path from "path";
import { Request, Response } from "express";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage");

const router = Router();
router.post("/login", authenticateUser);
router.post("/register", async (req, res, next) => {
  try {
    //listing messages in users mailbox
    registerUser(req, res);
  } catch (err) {
    next(err);
  }
});
router.get("/", getUserByEmail);
router.post("/uploadProfile", upload, uploadProfile);
router.post("/uploadMedia", upload, uploadMedia);
router.put("/", updateUser);

export default router;
