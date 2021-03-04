import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Chat, { IChat } from "../modules/chatModel";
import { IUser } from "../modules/userModel";

const currentUser = 1;

export const addChat = async (req: Request, res: Response) => {
  try {
    const userBody: IChat = req.body;
    const toAdd: IChat = {
      ChatId: userBody.ChatId,
      Messages: userBody.Messages,
      UserId1: userBody.UserId1,
      UserId2: userBody.UserId2
    };
    const chatAdded = await Chat.create(toAdd);
    res.status(200).json({ message: "chat added", ...chatAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const userBody: IChat = req.body;
    const toUpdate: IChat = {
      ChatId: userBody.ChatId,
      Messages: userBody.Messages,
      UserId1: userBody.UserId1,
      UserId2: userBody.UserId2
    };
    var query = {'ChatId': userBody.ChatId};

    const chatUpdated = await Chat.findOneAndUpdate(query,toUpdate);
    res.status(200).json({ message: "chat updated", ...chatUpdated });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getChatsByUser = async (req: Request, res: Response) => {
  const userBody: IUser = req.body;

  await Chat.find(
    { $or: [ { UserId1: currentUser } , { UserId2: currentUser } ] },
    (err: CallbackError, chats: IChat[]) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(chats);
      }
    }
  );
};
