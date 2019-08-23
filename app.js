const express = require("express");
// 全局路径的库
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// 引入express-session
const session = require("express-session");

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

// 获取文章
app.get("/articles/:id", (req, res) => {
  // req.params.id 获取上面地址中的id
  Article.findById(req.params.id, (err, article) => {
    res.render("show", {
      article: article
    });
  });
});

// 编辑文章
app.get("/articles/:id/edit", (req, res) => {
  // req.params.id 获取上面地址中的id
  Article.findById(req.params.id, (err, article) => {
    res.render("edit", {
      title: "Edit Article",
      article: article
    });
  });
});

// 创建文章
app.post("/articles/create", (req, res) => {
  // 利用model新建对象
  let article = new Article();

  // 获取输入的值
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  // 保存到数据库
  article.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      // 显示创建成功的弹框提示
      req.flash("success", "Article Added");
      // 跳转到首页
      res.redirect("/");
    }
  });
});

// 更新文章
app.post("/articles/update/:id", (req, res) => {
  let query = { _id: req.params.id };

  // 更新，第一个参数传id进行查询，第二个参数传更新的内容
  Article.update(query, req.body, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      // 跳转到首页
      res.redirect("/");
    }
  });
});

// 删除文章
app.delete("/articles/:id", (req, res) => {
  let query = { _id: req.params.id };

  Article.remove(query, err => {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
