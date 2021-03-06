import { response, Router } from "express";
import {
  addUser,
  getUserById,
  login,
  uploadFile,
} from "../controllers/userController";
import * as multer from "multer";
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
router.post("/login", login);
router.post("/", addUser);
router.get("/", getUserById);
router.post("/upload", upload, uploadFile);

export default router;
