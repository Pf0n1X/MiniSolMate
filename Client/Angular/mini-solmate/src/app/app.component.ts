import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IChat } from "../../../../../Server/src/modules/chatModel";
import { IMessage } from "../../../../../Server/src/modules/messageModel";
import { IUser } from "../../../../../Server/src/modules/userModel";
import { IClientChat } from './Interfaces/ClientChat';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-solmate';
  connected: Boolean = false;
  currentUser = '';
  currentChat!: IClientChat;
  messages: IMessage[] = [];
  newMessage = '';
  username = '';
  chatName = '';
  chatList: IChat[] = []
  clientChatList: IClientChat[] = []
  // chatList: IChat[] = [{ ChatId: 1, UserId1: "Eden", UserId2: "Other", Messages: [{ MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Eden" }, { MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Other" }] }];
  private chatUrl = 'http://localhost:3001/chat'; // URL to web api
  private userUrl = 'http://localhost:3001/user'; // URL to web api
  @ViewChild('scroll', { static: true }) scroll: any;
  headers!: HttpHeaders;
  ws!: WebSocketSubject<any>;

  constructor(private http: HttpClient) {

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  async webSocket() {
    this.ws = webSocket({
      url: 'ws://localhost:8999/' + this.currentUser,
      deserializer: e => e.data
    });
    this.ws.subscribe({
      next: (data) => {
        this.getChatsOfUser('NEW_MESSAGE', Number(data))
      },
      error: (err) => { console.log(`Error: ${err}`) },
      complete: () => { }
    });
  }

  async openChat(chatID: number) {
    const chat = this.clientChatList.find(chat => chat.ChatId == chatID)
    if (chat != undefined) {
      const index = this.clientChatList.indexOf(chat);
      this.clientChatList[index].IsNew = false;
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

  async deleteChat() {

    let params = new HttpParams();
    params = params.append('ChatId', this.currentChat.ChatId.toString());

    this.http.delete(this.chatUrl, {
      headers: this.headers,
      params: params
    })
      .subscribe(data => {
        console.log(data);
        this.getChatsOfUser('', 0)
      });
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

    var otherClient = chat.UserId1;
    if (otherClient == this.currentUser)
      otherClient = chat.UserId2;

    this.http.put(this.chatUrl, JSON.stringify(chat), {
      headers: this.headers
    })
      .subscribe(data => {
        console.log(data);
        var serverMsg = { sender: this.currentUser, reciver: otherClient, ChatId: chat.ChatId }
        this.ws.next(serverMsg);
        this.getChatsOfUser('', 0)
      });
  }

  getChatsOfUser(event: string, chatID: number) {
    interface ClientChat {
      ChatId: number,
      Messages: Array<Array<ClientMsg>>,
      UserId1: string,
      UserId2: string,
    };
    interface ClientMsg {
      MsgId: number;
      msgDate: string;
      text: string;
      sender: string;
    };

    this.clientChatList = [];

    let params = new HttpParams();
    params = params.append('UserId', this.currentUser.toString());

    this.http.get(this.chatUrl, {
      headers: this.headers,
      params: params
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
          const IclientChat: IClientChat = {
            ChatId: chat.ChatId,
            UserId1: chat.UserId1,
            UserId2: chat.UserId2,
            Messages: chat.Messages,
            Username: result[0].firstName + " " + result[0].lastName,
            IsNew: false
          };
          this.clientChatList.push(IclientChat);
        }

        this.clientChatList.sort(function (a, b) {
          return new Date(b.Messages[b.Messages.length - 1].msgDate).getTime() - new Date(a.Messages[a.Messages.length - 1].msgDate).getTime();
        });

        if (event === "NEW_MESSAGE") {
          const newchat = this.clientChatList.find(chat => chat.ChatId == chatID)
          if (newchat != undefined) {
            const index = this.clientChatList.indexOf(newchat);
            this.clientChatList[index].IsNew = true;
          }
        }

        if (this.currentChat != undefined)
          this.openChat(this.currentChat.ChatId);
      });
  }

  async getUser(userID: string) {

    let params = new HttpParams();
    params = params.append('UserId', userID);

    let result = await this.http.get(this.userUrl, {
      headers: this.headers,
      params: params
    })
      .toPromise();
    return result;
  }

  async connectToChat() {
    this.connected = true;
    this.currentUser = this.username;
    this.getChatsOfUser('', 0)
    this.webSocket();
  }

  public scrollToBottom() {
    const elementList = document.querySelectorAll('.' + "scroll");
    const element = elementList[0] as HTMLElement;
    element.scroll(0, Number.MAX_SAFE_INTEGER);
  }
}