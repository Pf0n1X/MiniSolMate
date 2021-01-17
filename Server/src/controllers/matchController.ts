import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Match, { IMatch } from "../modules/matchModel";
import { IUser } from "../modules/userModel";

export const addMatch = async (req: Request, res: Response) => {
  try {
    const userBody: IMatch = req.body;
    const toAdd: IMatch = {
      UserId1: userBody.UserId1,
      UserId2: userBody.UserId1,
      Approve1: userBody.Approve1,
      Approve2: userBody.Approve2,
    };
    const matchAdded = await Match.create(toAdd);
    res.status(200).json({ message: "Match added", ...matchAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getMatchesById = async (req: Request, res: Response) => {
  await Match.find(
    { UserId1: +(req.query.UserId1 + "") } || {
      UserId2: +(req.query.UserId2 + ""),
    },
    (err: CallbackError, user: IMatch) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    }
  );
};
