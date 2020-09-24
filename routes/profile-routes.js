const express = require("express");
const passport = require("passport");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const router = express.Router();

const User = require("../models/user-model");
const Category = require("../models/category-model");
const Entry = require("../models/entry-model");

function getTotalAmount(objArr, tagStr) {
  return Object.values(objArr)
    .filter(({ categoryId }) => categoryId.tag === tagStr)
    .reduce((acc, { amount }) => acc + amount, 0)
    .toFixed(2);
}

router.get("/", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const categories = await Category.find({ userId: req.user._id });
    const entries = await Entry.find({ userId: req.user._id })
      .populate("categoryId", "tag");
    const income = getTotalAmount(entries, "Income");
    const essential = getTotalAmount(entries, "Essential");
    const lifestyle = getTotalAmount(entries, "Life Style");
    const priority = getTotalAmount(entries, "Priority");
    categories.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
    res.render("private/profile", { user: req.user, categories, income, essential, lifestyle, priority });
  } catch (err) {
    next(err);
  }
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
  const { userId } = req.params;
  await Category.deleteMany({ userId });
  await Entry.deleteMany({ userId })
  await User.findOneAndDelete({ _id: userId });
  res.redirect("/logout");
});

module.exports = router;