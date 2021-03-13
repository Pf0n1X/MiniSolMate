import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User, { IUser, IUserModel } from "../modules/userModel";
import * as config from "../config/config.json";
import { CallbackError, MapReduceOptions } from "mongoose";
import multer from "multer";
import * as path from "path";

///<reference path="../../../node_modules/@types/mongodb/index.d.ts" />
///<reference path="../../../node_modules/@types/mongoose/index.d.ts" />

export const registerUser = async (req: Request, res: Response) => {
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  const userBody: IUser = req.body;
  await User.create({
    email: userBody.email,
    password: hashedPassword,
    firstName: userBody.firstName,
    lastName: userBody.lastName,
    description: userBody.description,
    sex: userBody.sex,
    birthday: userBody.birthday,
    picture: userBody.picture,
    youtubeSong: userBody.youtubeSong,
    radiusSearch: userBody.radiusSearch,
    interestedSex: userBody.interestedSex,
    interestedAgeMin: userBody.interestedAgeMin,
    interestedAgeMax: userBody.interestedAgeMax,
    Genre: userBody.Genre,
    Artists: userBody.Artists,
    Chats: userBody.Chats,
    Media: userBody.Media,
    Songs: userBody.Songs,
  });

  const token = jwt.sign({ email: userBody.email }, config.secret, {
    expiresIn: 86400, // expires in 24 hours
  });

  const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (
      req: any,
      file: { originalname: string },
      cb: (arg0: null, arg1: string) => void
    ) {
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
  }).single("myImage");
  res.status(200).send({ token: token });
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err: any, user: any, info) {
      console.log(user);

      // no async/await because passport works only with callback ..
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const token = jwt.sign({ email: user.email }, config.secret);
        res.status(200).send({ user: user, token: token });
      }
    }
  )(req, res, next);
};

export const uploadMedia = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const pic = req.file.filename;
  console.log("try", pic, userId);
  await User.updateOne(
    {
      email: userId,
    },
    {
      $push: { Media: { $each: [pic] } },
    }
  ).exec((err: CallbackError, user: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(user);
    }
  });
};

export const uploadProfile = async (req: Request, res: Response) => {
  // try {
  // const userId = req.body._id;
  // const picture = req.body.picture;
  const pic = req.body.myImage;
  const userEmail = req.body.userId;
  console.log("here", req, req.file, req.body);
  await User.updateOne(
    {
      // _id: userId,
      email: userEmail,
    },
    {
      $set: {
        picture: req.file.filename,
      },
    }
  ).exec((err: CallbackError, user: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(user);
    }
  });

  //   console.log("Check");
  //   res.status(200).send(true);
  // } catch (e) {
  //   res.sendStatus(500);
  // }
};

export const updateUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const userId = req.body._id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const Songs = req.body.Songs;
  const description = req.body.description;
  const interestedAgeMin = req.body.interestedAgeMin;
  const interestedAgeMax = req.body.interestedAgeMax;
  const radiusSearch = req.body.radiusSearch;
  const sex = req.body.sex;
  const birthday = req.body.birthday;
  const interestedSex = req.body.interestedSex;
  try {
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          Songs: Songs,
          description: description,
          interestedAgeMin: interestedAgeMin,
          interestedAgeMax: interestedAgeMax,
          radiusSearch: radiusSearch,
          sex: sex,
          birthday: birthday,
          interestedSex: interestedSex,
        },
      }
    ).exec((err: CallbackError, user: any) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(user);
      }
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  let userEmail = req.query.UserEmail?.toString();
  await User.find({ email: userEmail }, (err: CallbackError, user: IUser) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(user);
    }
  }).populate("Songs");
};

export const getUsersForMatches = async () => {
  const users = await User.find({}, (err: CallbackError, users: IUser[]) => {
    if (err) {
      console.log(err);
    } else {
      return users;
    }
  });
  return users;
};
// declare function emit(k, v);

//@ts-ignore
export const getStatistics = async (req: Request, res: Response) => {
  const keys = ["Male", "Female"];
  const groupKey = "Num of songs";
  const data_to_d3 = [
    { [groupKey]: "10", Male: 0, Female: 0 },
    { [groupKey]: "20", Male: 0, Female: 0 },
    { [groupKey]: "30", Male: 0, Female: 0 },
    { [groupKey]: "40", Male: 0, Female: 0 },
    { [groupKey]: "50", Male: 0, Female: 0 },
  ];

  var mapFunction = function (
    this: MapReduceOptions<IUserModel, unknown, unknown>
  ) {
    //@ts-ignore
    emit(this.sex, this.Songs.length);
    // for (var key in this) {
    //   //@ts-ignore
    //   emit(key, null);
    // }
  };

  var reduceFunction = function (key: any, value: any) {
    // return value;
    return Array.isArray(value) ? value.reduce((a, b) => a + b) : value.length;
  };

  const options: MapReduceOptions<IUserModel, unknown, unknown> = {
    map: mapFunction,
    reduce: reduceFunction,
    out: { replace: "map_reduce_customers" },
    verbose: true,
  };

  let docs_send: any[] = [];
  let newPromise = new Promise(async (resolve, reject) => {
    const data = await User.mapReduce(options, async (err, res) => {
      if (err) console.log("what?", err);
      console.log("after");
      let cool = await res.collection
        .find({})
        .toArray(function (err: any, docs: any[]) {
          if (err) console.log("what?", err);
          docs_send = docs;
          console.log("the docs", docs);
          resolve(docs);
        });
    });
  });

  const data1 = await User.aggregate([
    {
      $group: {
        _id: "$sex",
        count: { $sum: 1 },
      },
    },
  ]);

  await newPromise;

  res.status(200).send({ docs_send, data1 });
};
