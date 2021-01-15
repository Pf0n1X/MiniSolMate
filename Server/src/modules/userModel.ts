import { model, Schema, Document } from "mongoose";

export interface IUser {
  firstName: string;
}

export interface IUserModel extends Document, IUser {}

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
});

export default model<IUserModel>("users", schema);
