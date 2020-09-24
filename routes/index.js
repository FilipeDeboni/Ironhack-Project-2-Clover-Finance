const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (!req.user) {
    return res.render('index');
  }
  res.redirect('/profile');
});

module.exports = router;
