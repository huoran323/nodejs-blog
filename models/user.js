let mongoose = require("mongoose");

// mongoose提供的语法
let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

let User = (module.exports = mongoose.model("User", userSchema));
