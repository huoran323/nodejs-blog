const express = require("express");
// 表单验证库
const { check, validationResult } = require("express-validator");

let router = express.Router();
// 导入article
let Article = require("../models/article");

router.get("/", (req, res) => {
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
    res.render("articles/index", {
      articles: articles
    });
  });
});

router.get("/new", (req, res) => {
  res.render("articles/new", {
    title: "Add Article"
  });
});

// 获取文章
router.get("/:id", (req, res) => {
  // req.params.id 获取上面地址中的id
  Article.findById(req.params.id, (err, article) => {
    res.render("articles/show", {
      article: article
    });
  });
});

// 编辑文章
router.get("/:id/edit", (req, res) => {
  // req.params.id 获取上面地址中的id
  Article.findById(req.params.id, (err, article) => {
    res.render("articles/edit", {
      title: "Edit Article",
      article: article
    });
  });
});

// 创建文章 第二个数组参数为express-validator的表单验证
router.post(
  "/create",
  [
    check("title")
      .isLength({ min: 1 })
      .withMessage("Title is required"),
    check("body")
      .isLength({ min: 1 })
      .withMessage("Body is required"),
    check("author")
      .isLength({ min: 1 })
      .withMessage("Author is required")
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("articles/new", {
        title: "Add Article",
        errors: errors.array()
      });
    } else {
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
    }
  }
);

// 更新文章
router.post("/update/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };

  Article.remove(query, err => {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

module.exports = router;
