import { model, Schema, Document } from "mongoose";

export interface IUser {
  UserId: number;
  unername: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: number;
  age: number;
  picture: string;
  youtubeSong: string;
  radiusSearch: number;
  intrestedSex: number;
  intrestedAge: number;
  Genre: Array<string>;
  Artists: Array<string>;
  Chats: Array<number>;
}
export interface IUserModel extends Document, IUser {}

const schema = new Schema({
  UserId: {
    type: Number,
    required: true,
    unique: true,
  },
  unername: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sex: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
  },
  youtubeSong: {
    type: String,
    required: true,
  },
  radiusSearch: {
    type: Number,
  },
  intrestedSex: {
    type: Number,
  },
  radiusAge: {
    type: Number,
  },
  Genre: [
    {
      type: String,
    },
  ],
  Artists: [
    {
      type: String,
    },
  ],
  Chats: [
    {
      type: Number,
    },
  ],
});

export default model<IUserModel>("users", schema);
