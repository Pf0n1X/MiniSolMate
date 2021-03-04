
import { IMessage } from "../../../../../../Server/src/modules/messageModel";

export interface IClientChat{
  ChatId: number,
  Messages: Array<IMessage>;
  UserId1: number,
  UserId2: number,
  Username: string,
};
