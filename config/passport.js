const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateRandomUsername = require("../utils/generateRandomUsername");
const createUser = require("../utils/createUser");

// Centralized error messages
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  INCORRECT_PASSWORD: "Incorrect password",
  ACCOUNT_CONFLICT:
    "Account already exists with this email under another Google account",
  SERVER_ERROR: "Internal server error",
  INVALID_PROFILE: "Invalid Google profile data",
};

module.exports = function (passport) {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Input validation
          if (!email || !password) {
            return done(null, false, {
              message: "Email and password are required",
            });
          }

          const user = await User.findOne({ where: { email } });
          if (!user) {
            return done(null, false, {
              message: ERROR_MESSAGES.USER_NOT_FOUND,
            });
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return done(null, false, {
              message: ERROR_MESSAGES.INCORRECT_PASSWORD,
            });
          }

          // Safely convert to plain object
          const userData = user.toJSON ? user.toJSON() : user;
          return done(null, userData);
        } catch (error) {
          console.error("Local strategy error:", error);
          return done(null, false, { message: ERROR_MESSAGES.SERVER_ERROR });
        }
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id: googleId, emails, displayName, photos } = profile;
          const email = emails?.[0]?.value;

          // Input validation
          if (!googleId || !email) {
            return done(null, false, {
              message: ERROR_MESSAGES.INVALID_PROFILE,
            });
          }

          let user = await User.findOne({ where: { googleId } });

          if (!user) {
            user = await User.findOne({ where: { email } });

            if (user) {
              if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
                user = user.toJSON ? user.toJSON() : user;
              } else if (user.googleId !== googleId) {
                return done(null, false, {
                  message: ERROR_MESSAGES.ACCOUNT_CONFLICT,
                });
              }
            }
          }

          if (!user) {
            const nameParts = (displayName || "").split(" ").filter(Boolean);
            const createResult = await createUser({
              googleId,
              email,
              firstName: nameParts[0] || "Google",
              middleName: nameParts[1] || "",
              lastName: nameParts.slice(2).join(" ") || "",
              username: generateRandomUsername(email),
              profileImageUrl: photos?.[0]?.value || "",
            });
            user = createResult.user.toJSON
              ? createResult.user.toJSON()
              : createResult.user;
          } else {
            user = user.toJSON ? user.toJSON() : user;
          }

          return done(null, user);
        } catch (error) {
          console.error("Google strategy error:", error);
          return done(null, false, { message: ERROR_MESSAGES.SERVER_ERROR });
        }
      }
    )
  );
};
