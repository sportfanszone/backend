require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Routes
app.use(require("./routes"));

app.listen(PORT, () =>
  console.log(`Server Up and running: http://localhost:${PORT}`)
);
