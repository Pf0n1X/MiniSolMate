import { Component } from '@angular/core';
import axios from 'axios';
import { IChat } from "../../../../../Server/src/modules/chatModel";
import { IMessage } from "../../../../../Server/src/modules/messageModel";


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
  chatList: IChat[] = [{ ChatId: 1, UserId1: "Eden", UserId2: "Other", Messages: [{ MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Eden" },{ MsgId: 1, msgDate: new Date().toLocaleString(), text: "hi", sender: "Other" }] }];

  async openChat(chatID: number) {
    
    const chat = this.chatList.find( chat => chat.ChatId == chatID )
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
  }

  async connectToChat() {
    this.connected = true;
  }
}