const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user-model");

const bcrypt = require("bcryptjs");

const saltRounds = 10;

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
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.options(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

router.get("/profile", (req, res, next) => {
  res.render("private/profile");
});

module.exports = router;
