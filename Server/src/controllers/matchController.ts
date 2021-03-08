import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Match, { IMatch, IMatchModel } from "../modules/matchModel";
import { IUser } from "../modules/userModel";
import { Types, ObjectId } from "mongoose";

export const addMatch = async (req: Request, res: Response) => {
  // try {
  //   const userBody: IMatch = req.body;
  //   const toAdd: IMatch = {
  //     UserId1: userBody.UserId1,
  //     UserId2: userBody.UserId1,
  //     Approve1: userBody.Approve1,
  //     Approve2: userBody.Approve2,
  //   };
  //   const matchAdded = await Match.create(toAdd);
  //   res.status(200).json({ message: "Match added", ...matchAdded });
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).send(e);
  // }
};

export const getMatchesById = async (req: Request, res: Response) => {

  var userID = req.query.userId?.toString();
  console.log("The user id is: " + userID);
  var objid = new Types.ObjectId(userID);

  // Find matches in
  if (userID !== undefined)
  await Match.findOne({
    $or: 
      [
        {
          $and: [
            {
              firstUser: userID
            },
            {
              Approve1: false
            }
          ]
        },
        {
          $and: [
            {
              secondUser: userID
            },
            {
              Approve2: false
            }
          ]
        }
      ]
  })
  .populate("firstUser")
  .populate("secondUser")
  .exec((err: CallbackError, user: any) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(user);
        }
    });
}