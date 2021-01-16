import { Request, Response } from "express";
import User, { IUser } from "../modules/userModel";

export const addUser = async (req: Request, res: Response) => {
  try {
    const toAdd: IUser = { firstName: "Adi 2" };
    const userAdded = await User.create(toAdd);
    res.status(200).json({ message: "User added", ...userAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
