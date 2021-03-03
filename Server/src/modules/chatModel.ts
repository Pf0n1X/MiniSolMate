import { model, Schema, Document } from "mongoose";
import { IMessage } from "../modules/messageModel";

export interface IChat {
  ChatId: number;
  Messages: Array<IMessage>;
  UserId1: String;
  UserId2: String;
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
    type: String,
    required: true,
  },
  UserId2: {
    type: String,
    required: true,
  },
});

export default model<IChatModel>("chats", schema);
