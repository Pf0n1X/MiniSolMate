import * as express from "express";
import * as bodyParser from "body-parser";
import { connect } from "mongoose";

// Routes
import userRouter from "../routes/userRoute";
import matchRouter from "../routes/matchRoute";
import chatRouter from "../routes/chatRoute";
import messageRouter from "../routes/messageRoute";
import * as cors from "cors";

const app = express();

export const startServer = async () => {
  // support application/json type post data
  app.use(bodyParser.json());
  //support application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  // Routes
  app.use("/static", express.static("uploads"));
  app.use("/user", userRouter);
  app.use("/match", matchRouter);
  app.use("/chat", chatRouter);
  app.use("/message", messageRouter);

  await new Promise((resolve, reject) => {
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log("Express server listening on port " + PORT);
      resolve(true);
    });
  });
};

export const mongoSetup = async () => {
  await connect("mongodb://localhost/mini_solmate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    loggerLevel: "debug",
  });

  console.log("Connected to db!");
};
