const express = require("express");
const passport = require("passport");

const router = express.Router();

const Categories = require("../models/category-model");

// ... Create categories
router.get("/new", (req, res) => res.render("private/categories-new"));

router.post("/new", async (req, res, next) => {
  const { name, tag } = req.body;
  try {
    await Categories.create({ userId: req.user._id, name, tag });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// ... Read categories
// This happens in profile and entries pages

// ... Update categories
router.get("/edit/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  console.log(categoryId)
  try {
    const category = await Categories.findOne({ _id: categoryId })
    res.render("private/categories-edit", { category });
  } catch (err) {
    next(err);
  }
});

router.post("/edit/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, tag } = req.body;
  try {
    await Categories.findOneAndUpdate({ _id: categoryId }, { name, tag });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

// ... Delete category
router.get("/delete/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    await Categories.findOneAndDelete({ _id: categoryId });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
})

module.exports = router;