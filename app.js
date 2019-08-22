const express = require("express");
// 全局路径的库
const path = require("path");

const app = express();

// 模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  // res.send("hello");
  // res.render("index", {
  //   title: "Articles"
  // }); //指定渲染index.pug模板引擎,render第二个参数向模板引擎中传入变量参数
  let articles = [
    {
      id: 1,
      title: "Title One",
      author: "hfpp2012"
    },
    {
      id: 2,
      title: "Title Two",
      author: "hfpp2012"
    },
    {
      id: 3,
      title: "Title Three",
      author: "hfpp2012"
    }
  ];
  res.render("index", {
    articles: articles
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
