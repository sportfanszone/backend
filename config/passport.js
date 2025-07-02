const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateRandomUsername = require("../utils/generateRandomUsername");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });
          if (!user) return done(null, false, { message: "User not found" });

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch)
            return done(null, false, { message: "Incorrect password" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await User.findOne({ where: { googleId: profile.id } });
          if (!user) {
            const nameParts = profile.displayName.split(" ");

            const googleId = profile.id;
            const firstName = nameParts[0] || "Google";
            const middleName = nameParts[2] ? nameParts[1] : null;
            const lastName = nameParts[2] || nameParts[1];
            const profileImageUrl = profile.photos?.[0]?.value;

            const email = profile.emails?.[0]?.value;
            const username = generateRandomUsername(email);

            console.table({
              googleId,
              firstName,
              middleName,
              lastName,
              username,
              email: profile.emails[0].value,
              profileImageUrl,
            });

            const userCreated = await require("../utils/createUser")({
              googleId,
              firstName,
              middleName,
              lastName,
              username,
              email: profile.emails[0].value,
              profileImageUrl,
            });
            return done(null, userCreated.user);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
