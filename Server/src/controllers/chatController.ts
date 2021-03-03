import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Chat, { IChat } from "../modules/chatModel";
import { IUser } from "../modules/userModel";

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
export const getChatsByUser = async (req: Request, res: Response) => {
  const userBody: IUser = req.body;

  await Chat.find(
    { ChatId: { $in: userBody.Chats } },
    (err: CallbackError, user: IChat) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    }
  );
};
