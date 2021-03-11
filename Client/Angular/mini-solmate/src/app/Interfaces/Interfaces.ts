import { Icu } from "@angular/compiler/src/i18n/i18n_ast";

export interface IClientUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  description: string;
  sex: number;
  birthday: string;
  picture: string;
  userDesc: string;
  youtubeSong: string;
  radiusSearch: number;
  interestedSex: number;
  interestedAgeMin: number;
  interestedAgeMax: number;
  Genre: Array<string>;
  Artists: Array<string>;
  Chats: Array<number>;
  Songs: Array<string>;
}

export interface IClientMessage {
  MsgId: number;
  msgDate: string;
  text: string;
  sender: IClientUser;
}

export interface IClientChat{
  ChatId: number,
  Messages: Array<IClientMessage>;
  UserId1: IClientUser,
  UserId2: IClientUser,
  Username: string,
  IsNew: boolean
};

export interface IClientData {
  token: string,
  user: IClientUser
}

