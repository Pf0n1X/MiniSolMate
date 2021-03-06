
import { IMessage } from "../../../../../../Server/src/modules/messageModel";

export interface IClientChat{
  ChatId: number,
  Messages: Array<IMessage>;
  UserId1: string,
  UserId2: string,
  Username: string,
  IsNew: boolean
};
