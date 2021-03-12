import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IClientUser, IClientMessage, IClientData, IClientChat } from './Interfaces/Interfaces';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-solmate';
  connected: Boolean = false;
  error: Boolean = false;
  currentUser!:IClientUser;
  currentChat!: IClientChat;
  emptyChat!: IClientChat;
  messages: IClientMessage[] = [];
  chatName = '';
  newMessage = '';
  username = '';
  currentUserName = '';
  password = '';
  token = '';
  chatList: IClientChat[] = []
  clientChatList: IClientChat[] = []
  private chatUrl = 'http://localhost:3001/chat'; // URL to web api
  private userUrl = 'http://localhost:3001/user'; // URL to web api }
  @ViewChild('scroll', { static: true }) scroll: any;
  headers!: HttpHeaders;
  ws!: WebSocketSubject<any>;

  constructor(private http: HttpClient) {

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  async webSocket() {
    this.ws = webSocket({
      url: 'ws://localhost:8999/' + this.currentUser._id,
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
    } else {
      this.currentChat = this.emptyChat;
      this.messages = [];
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

    var otherClient = this.currentChat.UserId1;
    if (otherClient._id == this.currentUser._id)
      otherClient = this.currentChat.UserId2;

    this.http.delete(this.chatUrl, {
      headers: this.headers,
      params: params
    })
      .subscribe(data => {
        console.log(data);
        var serverMsg = { sender: this.currentUser._id, reciver: otherClient._id , ChatId: this.currentChat.ChatId }
        this.ws.next(serverMsg);
        this.getChatsOfUser('', 0)
      });
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const newMessage: IClientMessage = { MsgId: this.currentChat.Messages.length + 1, msgDate: new Date().toLocaleString(), sender: this.currentUser, text: this.newMessage };
    this.currentChat.Messages.push(newMessage);
    this.messages = this.currentChat.Messages;
    this.newMessage = "";
    this.updateChat(this.currentChat);
  }

  updateChat(chat: IClientChat) {

    var otherClient = chat.UserId1;
    if (otherClient._id == this.currentUser._id)
      otherClient = chat.UserId2;

    this.http.put(this.chatUrl, JSON.stringify(chat), {
      headers: this.headers
    })
      .subscribe(data => {
        console.log(data);
        var serverMsg = { sender: this.currentUser._id, reciver: otherClient._id, ChatId: chat.ChatId }
        this.ws.next(serverMsg);
        this.getChatsOfUser('', 0)
      });
  }

  getChatsOfUser(event: string, chatID: number) {

    this.clientChatList = [];

    let params = new HttpParams();
    params = params.append('UserId', this.currentUser._id);

    this.http.get(this.chatUrl, {
      headers: this.headers,
      params: params
    })
      .subscribe(async data => {

        let arr: Array<IClientChat> = (data as Array<IClientChat>).map(item => {
          return {
            ...item,
          }
        });

        for (let chat of arr) {
          let result;
          if (chat.UserId1._id != this.currentUser._id)
            result = chat.UserId1;
          else result = chat.UserId2;
          const IclientChat: IClientChat = {
            ChatId: chat.ChatId,
            UserId1: chat.UserId1,
            UserId2: chat.UserId2,
            Messages: chat.Messages,
            Username: result.firstName + " " + result.lastName,
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
    return result as IClientUser;
  }

  async connectToChat() {
    this.Login({
      email: this.username,
      password: this.password
    })

  }

  public scrollToBottom() {
    const elementList = document.querySelectorAll('.' + "scroll");
    const element = elementList[0] as HTMLElement;
    element.scroll(0, Number.MAX_SAFE_INTEGER);
  }

  async Login(credentials: any) {
    this.http.post("http://localhost:3001/user/login", credentials, {
      headers: this.headers
    })
      .subscribe(async data => {
        var clientData = data as IClientData;
        this.token = clientData.token;
        this.currentUser = clientData.user;
        this.currentUserName = this.currentUser.firstName + " " + this.currentUser.lastName;
        this.headers = this.headers.append('Authorization',  'Bearer ' + this.token);
        this.connected = true;
        this.getChatsOfUser('', 0)
        this.webSocket();
      }
        , err => {
          console.log(err);
          this.error = true
        });
  }
}