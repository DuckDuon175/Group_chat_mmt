import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { config } from "./config";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function getIndexHtml() {
  return fs
    .readFileSync(path.resolve(__dirname, "../../www/index.html"))
    .toString();
}

app.get("/", (req, res) => {
  var templateHtml = getIndexHtml();
  var responseHtml = templateHtml
    .replace(
      "$sso-redirect-url$",
      `http://${config.APP_HOST}:${config.APP_PORT}/identity`
    );

  res.send(responseHtml);
});

app.get("/identity", (req: Request, res: Response) => {
  return res.render("login", {
    registerurl: `${config.SSO_URL}/register`,
    ssourl: `${config.SSO_URL}/login`,
  });
});

app.post("/", async (req: Request, res: Response, next) => {
  try {
    const user = JSON.parse(req.body.user);
    console.log(user);
    const templateHtml = getIndexHtml();
    var responseHtml = templateHtml.replace(
      "$context$", JSON.stringify(user)
    );
    res.send(responseHtml);
  } catch (e) {
    console.log("false");
    console.log(e);
  }
});

app.use(
  express.static(path.resolve(__dirname, "../../www")),
  express.json({ limit: "500kb" }),
  express.urlencoded({ extended: true, limit: "500kb" })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../view"));
app.post("/register", (req: Request, res: Response) => {
  res.send("register");
});

app.get("/test", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("*", (req, res) => res.redirect("/"));
// catch exception and log
app.use((err: any, req: any, res: any, next: any) => {
  if (err.stack) {
    console.log(
      `node server error. \nTime: ${new Date()} \nPlease refer to the attached message: \nError code: ${
        err.code
      } \nError message: ${err.message} \nError stack: ${err.stack} \n`
    );
    err.stack = "";
    err.message = "internal server error";
    next(err);
  } else {
    next();
  }
});

app.listen(config.APP_PORT, config.APP_HOST, () => {
  console.log(
    `Server is running at http://${config.APP_HOST}:${config.APP_PORT}`
  );
});
