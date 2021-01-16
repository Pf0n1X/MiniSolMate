import { Request, Response } from "express";
import User, { IUser } from "../modules/userModel";

export const addUser = async (req: Request, res: Response) => {
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
      intrestedAge: userBody.intrestedAge,
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
