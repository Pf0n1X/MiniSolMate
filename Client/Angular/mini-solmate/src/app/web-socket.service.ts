import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  readonly uri: string = "ws://localhost:3001";

  constructor() {
    // var io = require("socket.io-client");
    // this.socket = io(this.uri);
  }

  listen(eventName: string) {
    console.log("a");
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        console.log("b");
        subscriber.next(data);
      })
    })
  }
}
