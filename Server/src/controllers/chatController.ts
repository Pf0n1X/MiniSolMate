import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Chat, { IChat } from "../modules/chatModel";
import { IUser } from "../modules/userModel";
import express from "express";
import * as http from "http";
import * as WebSocket from "ws";

const app = express();

const server = http.createServer(express());

const wss = new WebSocket.Server({ server });
var clients: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
  var id = Math.random();
  console.log("connection is established : " + id);
  clients[id] = ws;
  clients.push(ws);
  // Print and echo
  ws.on("message", (data) => {
    console.log(`received: ${data}`);
    for (var i = 0; i < clients.length; i++) {
      clients[i].send("sent to all");
    }
  })
});

// Start server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${(<WebSocket.AddressInfo>server.address()).port}`
  );
});

export const addChat = async (req: Request, res: Response) => {
  try {
    const userBody: IChat = req.body;
    const toAdd: IChat = {
      ChatId: userBody.ChatId,
      Messages: userBody.Messages,
      UserId1: userBody.UserId1,
      UserId2: userBody.UserId2,
    };
    const chatAdded = await Chat.create(toAdd);
    res.status(200).json({ message: "chat added", ...chatAdded });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const userBody: IChat = req.body;
    const toUpdate: IChat = {
      ChatId: userBody.ChatId,
      Messages: userBody.Messages,
      UserId1: userBody.UserId1,
      UserId2: userBody.UserId2,
    };
    var query = { ChatId: userBody.ChatId };
    const chatUpdated = await Chat.findOneAndUpdate(query, toUpdate);
    res.status(200).json({ message: "chat updated", ...chatUpdated });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getChatsByUser = async (req: Request, res: Response) => {
  var userID = Number(req.query.UserId);

  await Chat.find(
    { $or: [{ UserId1: userID }, { UserId2: userID }] },
    (err: CallbackError, chats: IChat[]) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(chats);
      }
    }
  );
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    console.log(req.query.ChatId);
    var query = { 'ChatId': Number(req.query.ChatId) };
    const chatDeleted = await Chat.findOneAndDelete(query);
    res.status(200).json({ message: "chat deleted", ...chatDeleted });

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
