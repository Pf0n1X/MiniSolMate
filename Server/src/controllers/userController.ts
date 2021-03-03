import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User, { IUser, IUserModel } from "../modules/userModel";
import * as config from "../config/config.json";
import { CallbackError } from "mongoose";
export const registerUser = async(req: Request, res: Response) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const userBody: IUser = req.body;
    await User.create({
      email: userBody.email,
      password: hashedPassword,
      firstName: userBody.firstName,
      lastName: userBody.lastName,
      sex: userBody.sex,
      age: userBody.age,
      picture: userBody.picture,
      youtubeSong: userBody.youtubeSong,
      radiusSearch: userBody.radiusSearch,
      intrestedSex: userBody.intrestedSex,
      intrestedAgeMin: userBody.intrestedAgeMin,
      intrestedAgeMax: userBody.intrestedAgeMax,
      Genre: userBody.Genre,
      Artists: userBody.Artists,
      Chats: userBody.Chats,

    });

    const token = jwt.sign({ email: userBody.email}, config.secret,{
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ token: token });
  }


  export const authenticateUser = ( req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {session: false} ,function (err: any, user: any,info ) {
      console.log(user);

      // no async/await because passport works only with callback ..
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const token = jwt.sign({ email: user.email }, config.secret);
        res.status(200).send({ user:user ,token: token });
      }
    })(req, res, next);
  }
  
