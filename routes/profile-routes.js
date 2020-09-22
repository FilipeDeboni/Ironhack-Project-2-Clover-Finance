const express = require("express");
const passport = require("passport");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const router = express.Router();

const User = require("../models/user-model");

router.get("/", (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("private/profile", { user: req.user });
});

router.get("/edit/:userId", async (req, res, next) => {
  console.log('edit page');
  if (!req.user) {
    return res.redirect("/login");
  }
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    res.render("private/profile-edit", { user });
  } catch (err) {
    return next(err);
  }
});

router.post("/edit/:userId", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    if (password) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const passwordHash = bcrypt.hashSync(password, salt);
      await User.findOneAndUpdate({ _id: req.params.userId }, { passwordHash });
    }
    await User.findOneAndUpdate({ _id: req.params.userId }, { username, email });
    res.redirect("/profile");
  } catch (err) {
    return next(err);
  }
});

router.get("/delete/:userId", async (req, res, next) => {
  await User.findOneAndDelete({ _id: req.params.userId });
  res.redirect("/");
})

module.exports = router;