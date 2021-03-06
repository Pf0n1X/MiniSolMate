import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import { runInNewContext } from "vm";
import User, { IUser } from "../modules/userModel";

export const addUser = async (req: Request, res: Response) => {
  console.log("T1");
  try {
    const userBody: IUser = req.body;
    const toAdd: IUser = {
      UserId: userBody.UserId,
      unername: userBody.unername,
      password: userBody.password,
      firstName: userBody.firstName,
      lastName: userBody.lastName,
      email: userBody.email,
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
    };
    const userAdded = await User.create(toAdd);
    res.status(200).json({ message: "User added", ...userAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
export const getUserById = async (req: Request, res: Response) => {
  console.log("userid: " + req.query.UserId);
  await User.find(
    { UserId: +(req.query.UserId + "") },
    (err: CallbackError, user: IUser) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    }
  );
};

export const login = async (req: Request, res: Response) => {
  await User.find(
    { UserId: +(req.query.UserId + "") },
    (err: CallbackError, user: IUser) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    }
  );
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log("Check");
    res.status(200).send(true);
  } catch (e) {
    res.sendStatus(500);
  }
};
