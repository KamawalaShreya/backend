require("dotenv").config();

import express from "express";
import routes from "./routes/index";
import mongoConnection from "./model/connection";
import swagger from "./src/common/config/swagger";
import passport from "passport";
import session from 'express-session';
import handleError from './src/common/middleware/error-handler';
import "./src/common/config/jwt-strategy";
import path from "path";
const app = express();

app.use(
  session({
    secret: "sk11sk",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/mediaData", express.static(path.join(__dirname, "mediaData")));
app.use("/api/documentation", swagger);
app.use("/", routes);

app.use(handleError);
app.listen(process.env.PORT, () => {
  console.log(
    "App running on " + process.env.BASE_URL + ":" + process.env.PORT
  );
});
