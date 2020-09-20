const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  });

  passport.use(
    new LocalStrategy(
      {
        emailField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "Incorrect e-mail or password",
              });
            }
            if (!bcrypt.compareSync(password, user.passwordHash)) {
              return done(null, false, {
                message: "Incorrect e-mail or password",
              });
            }
            done(null, user);
          })
          .catch((err) => done(err));
      }
    )
  );
};
