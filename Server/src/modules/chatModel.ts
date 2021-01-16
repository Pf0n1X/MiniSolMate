import { model, Schema, Document } from "mongoose";
import { IMessage } from "../modules/messageModel";

export interface IChat {
  ChatId: number;
  Messages: Array<IMessage>;
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
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
});

export default model<IChatModel>("chats", schema);
