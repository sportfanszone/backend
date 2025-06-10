const router = require("express").Router();

router.use("/api", require("./api"));

router.get("/", (req, res) => {
  res.json({ status: "success" });
});

module.exports = router;
