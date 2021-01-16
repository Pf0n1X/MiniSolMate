import { Request, Response } from "express";
import Chat, { IChat } from "../modules/chatModel";

export const addChat = async (req: Request, res: Response) => {
  try {
    const userBody: IChat = req.body;
    const toAdd: IChat = {
      ChatId: userBody.ChatId,
      Messages: userBody.Messages,
    };
    const chatAdded = await Chat.create(toAdd);
    res.status(200).json({ message: "chat added", ...chatAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
