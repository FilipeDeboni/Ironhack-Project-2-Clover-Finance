const express = require("express");
const passport = require("passport");

// const User = require("../models/user-model");
const Entry = require("../models/entry-model");
const Categories = require("../models/category-model");

const router = express.Router();

// ... Create entry
router.get("/new", async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const categories = await Categories.find({ userId: req.user._id });
    categories.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
    res.render("private/entries-new", { categories });
  } catch (err) {
    console.error(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    let { amount, date, description, category } = req.body;
    if (!date) date = Date.now();
    category = await Categories.findOne({ userId: req.user._id, name: category });
    await Entry.create({ userId: req.user._id, categoryId: category._id, amount, description, date });
    res.redirect("/entries");
  } catch (err) {
    next(err);
  }
});

// ... Read user entries
router.get("/", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const entriesFromDB = await Entry.find({ userId: req.user._id })
      .populate("categoryId", "-_id -userId -__v");
    const entries = Object.values(entriesFromDB).map((entry) => {
      return { ...entry._doc, amount: entry._doc.amount.toFixed(2) };
    });
    res.render("private/entries", { entries });
  } catch (err) {
    return next(err);
  }
});


// ... Update entries
router.get("/edit/:entryId", async (req, res, next) => {
  const { entryId } = req.params;
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const categories = await Categories.find({ userId: req.user._id });
    categories.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
    const entry = await Entry.findOne({ _id: entryId });
    res.render("private/entries-edit", { categories, entry });
  } catch (err) {
    console.error(err);
  }
});

router.post("/edit/:entryId", async (req, res, next) => {
  let { amount, description, category } = req.body;
  const { entryId } = req.params;
  try {
    category = await Categories.findOne({ userId: req.user._id, name: category });
    await Entry.findOneAndUpdate({ _id: entryId }, { categoryId: category._id, amount, description });
    res.redirect("/entries");
  } catch (err) {
    next(err);
  }
});

// ... Delete entries
router.post("/delete/:entryId", async (req, res, next) => {
  const { entryId } = req.params;
  await Entry.findOneAndDelete({ _id: entryId })
  res.redirect("/entries");
});

module.exports = router;