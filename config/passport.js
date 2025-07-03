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
          const { id: googleId } = profile;
          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({ where: { googleId } });

          if (!user) {
            // Then check for user by email
            user = await User.findOne({ where: { email } });

            if (user) {
              // ✅ Only attach googleId if it's not already set
              if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
              } else if (user.googleId !== googleId) {
                // 🚫 Mismatch: this could be an account hijack attempt
                return done(
                  new Error(
                    "Account already exists with this email under another Google account"
                  )
                );
              }
            }
          }

          if (!user) {
            // Create new user
            const nameParts = profile.displayName.split(" ");
            user = await createUser({
              googleId,
              email,
              firstName: nameParts[0] || "Google",
              middleName: nameParts[1] || "",
              lastName: nameParts[2] || "",
              username: generateRandomUsername(email),
              profileImageUrl: profile.photos?.[0]?.value,
            });
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
