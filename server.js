require("dotenv").config();

const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

require("./config/passport")(passport);

// Initialize Sequelize session store
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: "Sessions",
  checkExpirationInterval: 15 * 60 * 1000, // Clean expired sessions every 15 minutes
  expiration: 3 * 60 * 1000, // 3 minutes
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://sportfanszone.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 60 * 1000, // 3 minutes
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes"));

sessionStore.sync(); // Sync session table with MySQL

db.sequelize
  .sync({ force: false, alter: false, benchmark: true })
  .then(() => {
    console.log(`Database connection successful!`);
    app.listen(PORT, () =>
      console.log(`Server Up and running: http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("Database connection failed!", error));
