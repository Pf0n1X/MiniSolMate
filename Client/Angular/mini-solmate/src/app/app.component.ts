import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import { IChat } from "../../../../../Server/src/modules/chatModel";
import { IMessage } from "../../../../../Server/src/modules/messageModel";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-solmate';
  connected: Boolean = true;
  currentUser = "Eden";
  currentChat!: IChat;
  messages: IMessage[] = [];
  newMessage = '';
  username = '';
  chatList: IChat[] = [{ ChatId: 1, UserId1: "Eden", UserId2: "Other", Messages: [{ MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Eden" }, { MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Other" }] }];
  private messageUrl = 'http://localhost:3000/message'; // URL to web api
  private chatUrl = 'http://localhost:3000/chat'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { 
    this.getChatsOfUser()
  }

  async openChat(chatID: number) {

    const chat = this.chatList.find(chat => chat.ChatId == chatID)
    if (chat != undefined) {
      this.currentChat = chat;
      this.messages = chat.Messages;
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const newMessage: IMessage = { MsgId: this.currentChat.Messages.length + 1, msgDate: new Date().toLocaleString(), sender: this.currentUser, text: this.newMessage };
    this.currentChat.Messages.push(newMessage);
    this.messages = this.currentChat.Messages;
    this.newMessage = "";
    this.addMessage(newMessage);
  }

  addMessage(newMessage: IMessage) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    this.http.post(this.messageUrl, JSON.stringify(newMessage), {
      headers: headers
    })
      .subscribe(data => {
        console.log(data);
      });
  }

  getChatsOfUser() {
    interface ClientChat{
      ChatId: number,
      Messages: Array<Array<ClientMsg>>,
      UserId1: string,
      UserId2: string
    };
    interface ClientMsg{
      MsgId: number;
      msgDate: string;
      text: string;
      sender: string;
    };

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    this.http.get(this.chatUrl, {
      headers: headers
    })
      .subscribe(data => {
        let arr: Array<IChat> = (data as Array<ClientChat>).map(item => {
          return {
            ...item,
            Messages: item.Messages.map(msg => {
              return msg[0];
            })

          }});


        this.chatList = arr;
      });
  }

  async connectToChat() {
    this.connected = true;
  }
}