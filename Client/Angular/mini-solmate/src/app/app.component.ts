import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IChat } from "../../../../../Server/src/modules/chatModel";
import { IMessage } from "../../../../../Server/src/modules/messageModel";
import { IUser } from "../../../../../Server/src/modules/userModel";
import { IClientChat } from './Interfaces/ClientChat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-solmate';
  connected: Boolean = true;
  currentUser = 1;
  currentChat!: IClientChat;
  messages: IMessage[] = [];
  newMessage = '';
  username = '';
  chatList: IChat[] = []
  clientChatList: IClientChat[] = []
  // chatList: IChat[] = [{ ChatId: 1, UserId1: "Eden", UserId2: "Other", Messages: [{ MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Eden" }, { MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Other" }] }];
  private chatUrl = 'http://localhost:3000/chat'; // URL to web api
  private userUrl = 'http://localhost:3000/user'; // URL to web api
  @ViewChild('scroll', { static: true }) scroll: any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.getChatsOfUser()
  }

  async openChat(chatID: number) {

    const chat = this.clientChatList.find(chat => chat.ChatId == chatID)
    if (chat != undefined) {
      this.currentChat = chat;
      this.messages = chat.Messages;
    }

    let divs = Array.from(document.getElementsByClassName('channels'));
    for (let div of divs) {
      if (div.id === chatID.toString()) {
        div.className += " chat_list_click";
      } else {
        div.className = "channels";
      }
    }
    this.scrollToBottom();
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const newMessage: IMessage = { MsgId: this.currentChat.Messages.length + 1, msgDate: new Date().toLocaleString(), sender: this.currentUser, text: this.newMessage };
    this.currentChat.Messages.push(newMessage);
    this.messages = this.currentChat.Messages;
    this.newMessage = "";
    this.updateChat(this.currentChat);
  }

  updateChat(chat: IChat) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    this.http.put(this.chatUrl, JSON.stringify(chat), {
      headers: headers
    })
      .subscribe(data => {
        console.log(data);
      });
  }

  getChatsOfUser() {
    interface ClientChat {
      ChatId: number,
      Messages: Array<Array<ClientMsg>>,
      UserId1: number,
      UserId2: number,
    };
    interface ClientMsg {
      MsgId: number;
      msgDate: string;
      text: string;
      sender: number;
    };

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    this.http.get(this.chatUrl, {
      headers: headers
    })
      .subscribe(async data => {
        let arr: Array<IChat> = (data as Array<ClientChat>).map(item => {
          return {
            ...item,
            Messages: item.Messages.map(msg => {
              return msg[0];
            })

          }
        });

        for (let chat of arr) {
          let result;
          if (chat.UserId1 != this.currentUser)
            result = await this.getUser(chat.UserId1) as IUser[];
          else result = await this.getUser(chat.UserId2) as IUser[];
          const IclientChat: IClientChat = { ChatId: chat.ChatId, UserId1: chat.UserId1, UserId2: chat.UserId2, Messages: chat.Messages, Username: result[0].firstName + " " + result[0].lastName };
          this.clientChatList.push(IclientChat);
        }
      });
  }

  async getUser(userID: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let params = new HttpParams();
    params = params.append('UserId', userID.toString());

    let result = await this.http.get(this.userUrl, {
      headers: headers,
      params: params
    })
      .toPromise();
    return result;
  }

  async connectToChat() {
    this.connected = true;
  }

  public scrollToBottom() {
    const elementList = document.querySelectorAll('.' + "scroll");
    const element = elementList[0] as HTMLElement;
    element.scroll(0, 1000);
  }
}