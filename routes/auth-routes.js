const express = require("express");
const passport = require("passport");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const router = express.Router();

const User = require("../models/user-model");
const Categories = require("../models/category-model");

function createFirstCategories(userId) {
  const income = ["Wage"];
  const essentials = ["Rent / Mortgage", "Groceries", "Basic Utilities", "Transport", "Education", "Health"];
  const lifestyles = ["Restaurant", "Clothing", "Streaming Service", "Electronics / Gadgets", "Selfcare", "Hobby", "Vacation", "Donation"];
  const priorities = ["Emergency Fund", "Bank Savings"]
  const initialCategories = [];
  income.forEach(item => {
    initialCategories.push({ userId, name: item, tag: "Income" })
  });
  essentials.forEach(item => {
    initialCategories.push({ userId, name: item, tag: "Essential" })
  });
  lifestyles.forEach(item => {
    initialCategories.push({ userId, name: item, tag: "Life Style" })
  });
  priorities.forEach(item => {
    initialCategories.push({ userId, name: item, tag: "Priority" })
  });
  return initialCategories;
}

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
    const user = await User.create({ username, email, passwordHash });
    // Create initial categories related to the new user
    const categories = createFirstCategories(user._id);
    categories.forEach(async item => await Categories.create(item));
    console.log("CREATED USER:", user._id);
    res.redirect("/login");
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