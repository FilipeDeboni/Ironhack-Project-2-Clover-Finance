const express = require("express");
const passport = require("passport");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const router = express.Router();

const User = require("../models/user-model");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render("auth/signup", {
      errMsg: "Error: all fields are required",
    });
  }
  try {
    if (await User.findOne({ email })) {
      return res.render("auth/signup", {
        errMsg: "E-mail already exists",
      });
    }
    // Generate encrypted password
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    // Create user in database
    User.create({ username, email, passwordHash });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { errMsg: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;