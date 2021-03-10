import { Request, Response } from "express";
import Song, { ISong } from "../modules/songModel";
import { CallbackError } from "mongoose";

export const getSongs = async (req: Request, res: Response) => {

  await Song.find(
    { },
    (err: CallbackError, message: ISong[]) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(message);
      }
    }
  );
};
