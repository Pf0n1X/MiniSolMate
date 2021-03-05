import { model, Schema, Document } from "mongoose";
import { IMessage } from "../modules/messageModel";

export interface IChat {
  ChatId: number;
  Messages: Array<IMessage>;
  UserId1: number;
  UserId2: number;
}
export interface IChatModel extends Document, IChat {}

const schema = new Schema({
  ChatId: {
    type: Number,
    required: true,
    unique: true,
  },
  Messages: [
    {
      type: Array,
    },
  ],
  UserId1: {
    type: Number,
    required: true,
  },
  UserId2: {
    type: Number,
    required: true,
  },
});

export default model<IChatModel>("chats", schema);
