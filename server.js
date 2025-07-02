require("dotenv").config();

const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;

const app = express();
const db = require("./models");

require("./config/passport")(passport);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));

db.sequelize
  .sync({ force: false, alter: false, benchmark: true })
  .then(() => {
    console.log(`Database connection successful!`);

    app.listen(PORT, () =>
      console.log(`Server Up and running: http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("Database connection failed!", error));
