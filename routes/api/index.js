const router = require("express").Router();
const { authenticate, authorizeRole } = require("../../middlewares/auth");

router.use(require("../../middlewares/loginVerifire"));
router.use("/auth", require("./auth"));
router.use("/root", require("./root"));
router.use("/pages", require("./pages"));
router.use(
  "/user",
  authenticate,
  authorizeRole("user", "admin"),
  require("./user")
);
router.use("/admin", require("./admin"));

router.use((req, res) => {
  res.status(404).json({
    status: "error",
  });
});

module.exports = router;
