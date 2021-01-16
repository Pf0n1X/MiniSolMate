import { model, Schema, Document } from "mongoose";

export interface IMatch {
  UserId1: number;
  UserId2: number;
  Approve1: boolean;
  Approve2: boolean;
}
export interface IMatchModel extends Document, IMatch {}

const schema = new Schema({
  UserId1: {
    type: Number,
    required: true,
    unique: true,
  },
  UserId2: {
    type: Number,
    required: true,
    unique: true,
  },
  Approve1: {
    type: Boolean,
  },
  Approve2: {
    type: Boolean,
  },
});

export default model<IMatchModel>("matches", schema);
