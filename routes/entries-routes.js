const express = require("express");
const passport = require("passport");

// const User = require("../models/user-model");
const Entry = require("../models/entry-model");
const Categories = require("../models/category-model");

const router = express.Router();

// ... Create entry
router.get("/new", async (req, res) => {
  try {
    const categories = await Categories.find({ userId: req.user._id });
    categories.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
    res.render("private/entries-new", { categories });
  } catch (err) {
    return next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    let { amount, date, description, category } = req.body;
    category = await Categories.find({ userId: req.user._id, name: category });
    if (!date) date = Date.now();
    if (category !== "income") {
      amount = - amount;
      await Entry.create({ userId: req.user._id, categoryId: category._id, amount, description, date });
    } else {
      await Entry.create({ userId: req.user._id, amount, description, date })
    }

    console.log("new entry!")
    res.redirect("/entries");
  } catch (err) {
    next(err);
  }
})

// ... Show all entries
router.get("/", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  try {
    const entries = await Entry.find({ userId: req.user._id });
    res.render("private/entries", entries);
  } catch (err) {
    return next(err);
  }
});



module.exports = router;