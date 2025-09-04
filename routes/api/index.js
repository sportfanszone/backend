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

router.get(
  "/get_clubs",
  authenticate,
  authorizeRole("user", "admin"),
  require("../../controllers/getClubs")
);
router.get("/get_leagues", require("../../controllers/getLeagues"));
router.get("/get_user/:userId", require("../../controllers/getUser"));

router.get("/slider", require("../../controllers/root/getSliderImages"));

router.use((req, res) => {
  res.status(404).json({
    status: "error",
  });
});

module.exports = router;
