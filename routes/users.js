const express = require("express");
// 引入加密密码的库
const bcrypt = require("bcrypt");

const passport = require("passport");

let router = express.Router();
// 导入article
let User = require("../models/user");
// 表单验证库
const { check, validationResult } = require("express-validator");

router.get("/register", function(req, res) {
  res.render("users/register");
});

router.post(
  "/register",
  [
    check("name")
      .isLength({ min: 1 })
      .withMessage("Name is required"),
    check("email")
      .isEmail()
      .withMessage("Invalid Email"),
    check("username")
      .isLength({ min: 1 })
      .withMessage("Username is required"),
    check("password", "invalid password")
      .isLength({ min: 1 })
      .custom((value, { req, loc, path }) => {
        // 验证密码与确认密码是否相同
        if (value !== req.body.password_confirmation) {
          throw new Error("Password donot match");
        } else {
          return value;
        }
      })
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("users/register", {
        errors: errors.array()
      });
    } else {
      // 利用model新建对象
      let user = new User(req.body);

      // 加密密码
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          if (err) {
            console.log(err);
            return;
          }

          user.password = hash;

          // 保存到数据库
          user.save(err => {
            if (err) {
              console.log(err);
              return;
            } else {
              // 显示创建成功的弹框提示
              req.flash("success", "You are now registered and log in");
              // 跳转到登录页
              res.redirect("/users/login");
            }
          });
        });
      });
    }
  }
);

router.get("/login", function(req, res) {
  res.render("users/login");
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
    successFlase: "Welcome"
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
