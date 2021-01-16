import { model, Schema, Document } from "mongoose";

export interface IMessage {
  MsgId: number;
  msgDate: Date;
  text: string;
}
export interface IMessageModel extends Document, IMessage {}

const schema = new Schema({
  MsgId: {
    type: Number,
    required: true,
    unique: true,
  },
  msgDate: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

export default model<IMessageModel>("messages", schema);
