import express from "express";
import * as bodyParser from "body-parser";
import userRouter from "../routes/userRoute";
import { connect } from "mongoose";
import { Server, createServer } from "http";
const app = express();
let server = createServer(app);

export const startServer = async () => {
  // support application/json type post data
  app.use(bodyParser.json());
  //support application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: false }));

  // Routes
  app.use("/user", userRouter);

  await new Promise((resolve, reject) => {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log("Express server listening on port " + PORT);
      resolve(true);
    });
  });
};

export const mongoSetup = async () => {
  await connect(process.env.DB_CON ? process.env.DB_CON : "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    loggerLevel: "debug",
  });

  console.log("Connected to db!");
};
