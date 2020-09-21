const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, cb) => {
    console.log("Serialize", user);
    cb(null, user._id);
  });

  passport.deserializeUser((id, cb) => {
    console.log(id);
    User.findOne({ _id: id })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              console.log("caiu no if do user");
              return done(null, false, {
                message: "Incorrect e-mail or password",
              });
            }
            if (!bcrypt.compareSync(password, user.passwordHash)) {
              console.log("caiu no if da senha");
              return done(null, false, {
                message: "Incorrect e-mail or password",
              });
            }
            console.log(user);
            done(null, user);
          })
          .catch((err) => {
            console.log(err);
            return done(err);
          });
      }
    )
  );
};
