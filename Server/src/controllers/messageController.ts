import { Request, Response } from "express";
import Message, { IMessage } from "../modules/messageModel";

export const addMsg = async (req: Request, res: Response) => {
  try {
    const userBody: IMessage = req.body;
    const toAdd: IMessage = {
      MsgId: userBody.MsgId,
      msgDate: userBody.msgDate,
      text: userBody.text,
    };
    const chatMsg = await Message.create(toAdd);
    res.status(200).json({ message: "message added", ...chatMsg });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
