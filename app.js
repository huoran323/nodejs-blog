const express = require("express");
// 全局路径的库
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// 引入express-session
const session = require("express-session");
// 表单验证库
const { check, validationResult } = require("express-validator");

// 连接数据库
mongoose.connect("mongodb://localhost/nodejs-blog");
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to Mongodb");
});

// 数据库连接错误的错误信息
db.on("error", err => {
  console.log(err);
});

const app = express();

app.use(
  session({
    secret: "keyboard cat", //秘钥
    resave: false,
    saveUninitialized: true
  })
);

// falsh中间件，用来显示一些成功等的提示
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

// 引入public
app.use(express.static(path.join(__dirname, "public")));

// 导入article
let Article = require("./models/article");

// 模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// 使用路由中间件引入routes的articles
let articles = require("./routes/articles");
let users = require("./routes/users");

// "/articles"即路由前缀，里面的路径可以不用写"/articles"，会自动与后面的地址拼接
app.use("/articles", articles);
app.use("/users", users);

// 根目录
app.get("/", (req, res) => {
  // Article.find会寻找数据库中Article的小写形式的复数数据库，即去寻找articles数据库；这是mongoose规定的
  Article.find({}, (err, articles) => {
    // articles从数据库获得
    res.render("articles/index", {
      articles: articles
    });
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
