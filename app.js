const express = require("express");
// 全局路径的库
const path = require("path");
const mongoose = require("mongoose");

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

// 导入article
let Article = require("./models/article");

// 模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  // res.send("hello");
  // res.render("index", {
  //   title: "Articles"
  // }); //指定渲染index.pug模板引擎,render第二个参数向模板引擎中传入变量参数

  // 模拟假数据
  // let articles = [
  //   {
  //     id: 1,
  //     title: "Title One",
  //     author: "hfpp2012"
  //   },
  //   {
  //     id: 2,
  //     title: "Title Two",
  //     author: "hfpp2012"
  //   },
  //   {
  //     id: 3,
  //     title: "Title Three",
  //     author: "hfpp2012"
  //   }
  // ];
  // res.render("index", {
  //   articles: articles
  // });

  // Article.find会寻找数据库中Article的小写形式的复数数据库，即去寻找articles数据库；这是mongoose规定的
  Article.find({}, (err, articles) => {
    // articles从数据库获得
    res.render("index", {
      articles: articles
    });
  });
});

app.get("/articles/new", (req, res) => {
  res.render("new", {
    title: "Add Article"
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
