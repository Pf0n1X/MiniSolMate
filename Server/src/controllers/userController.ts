import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User, { IUser, IUserModel } from "../modules/userModel";
import * as config from "../config/config.json";
import { CallbackError } from "mongoose";
import multer from "multer";
import * as path from "path";

export const registerUser = async (req: Request, res: Response) => {
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  const userBody: IUser = req.body;
  await User.create({
    email: userBody.email,
    password: hashedPassword,
    firstName: userBody.firstName,
    lastName: userBody.lastName,
    sex: userBody.sex,
    birthday: userBody.birthday,
    picture: userBody.picture,
    youtubeSong: userBody.youtubeSong,
    radiusSearch: userBody.radiusSearch,
    interestedSex: userBody.interestedSex,
    interestedAgeMin: userBody.interestedAgeMin,
    interestedAgeMax: userBody.interestedAgeMax,
    Genre: userBody.Genre,
    Artists: userBody.Artists,
    Chats: userBody.Chats
  });

  const token = jwt.sign({ email: userBody.email }, config.secret, {
    expiresIn: 86400, // expires in 24 hours
  });

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
  res.status(200).send({ token: token });
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err: any, user: any, info) {
      console.log(user);

      // no async/await because passport works only with callback ..
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const token = jwt.sign({ email: user.email }, config.secret);
        res.status(200).send({ user: user, token: token });
      }
    }
  )(req, res, next);
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log("Check");
    res.status(200).send(true);
  } catch (e) {
    res.sendStatus(500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.body._id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const Artists = req.body.Artists;
  const description = req.body.description;
  const interestedAgeMin = req.body.interestedAgeMin;
  const interestedAgeMax = req.body.interestedAgeMax;
  const radiusSearch = req.body.radiusSearch;
  const sex = req.body.sex;
  const birthday = req.body.birthday;
  const interestedSex = req.body.interestedSex;
  
  await User.updateOne({
      _id: userId
    }, { 
      $set: {
        firstName: firstName,
        lastName: lastName,
        Artists: Artists,
        description: description,
        interestedAgeMin: interestedAgeMin,
        interestedAgeMax: interestedAgeMax,
        radiusSearch: radiusSearch,
        sex: sex,
        birthday: birthday,
        interestedSex: interestedSex
    }})
    .exec((err: CallbackError, user: any) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
  })
};

export const getUserByEmail = async (req: Request, res: Response) => {
  let userEmail = req.query.UserId?.toString();
  await User.find(
    { email: userEmail },
    (err: CallbackError, user: IUser) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    }
  )
  .populate("Songs");
};

export const getUsersForMatches = async () => {

  const users = await User.find(
    { },
    (err: CallbackError, users: IUser[]) => {
      if (err) {
        console.log(err);
      } else {
        return users;
      }
    }
  );

  return users;
};