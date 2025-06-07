require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const bodyParser = require("body-parser");

// parse form data
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use(require("./routes"));

app.listen(PORT, () =>
  console.log(`Server Up and running: http://localhost:${PORT}`)
);
