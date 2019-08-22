let mongoose = require("mongoose");

// mongoose提供的语法
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

// 把articleSchema表结构赋给前面的Article
let Article = (module.exports = mongoose.model("Article", articleSchema));
