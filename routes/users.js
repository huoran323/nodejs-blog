const express = require("express");

let router = express.Router();

router.get("/register", function(req, res) {
  res.render("users/register");
});

module.exports = router;
