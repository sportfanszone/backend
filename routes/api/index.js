const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/root", require("./root"));
router.use("/pages", require("./pages"));

router.use((req, res) => {
  res.status(404).json({
    status: "error",
  });
});

module.exports = router;
