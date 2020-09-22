const express = require("express");
const passport = require("passport");

const User = require("../models/user-model");
const Entry = require("../models/entry-model");
const { find } = require("../models/user-model");

const router = express.Router();

// ... Show all entries
router.get("/:userId", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  const { userId } = req.params;
  try {
    const entries = await Entry.find({ userId });
    res.render("private/entries", entries);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;