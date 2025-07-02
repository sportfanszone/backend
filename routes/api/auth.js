const router = require("express").Router();
const passport = require("passport");

router.post("/signup", require("../../controllers/auth/signup"));
router.post("/verify_otp", require("../../controllers/auth/verifyOtp"));
router.post("/resend_otp", require("../../controllers/auth/resendOtp"));
router.post("/login", require("../../controllers/auth/login"));
router.post("/logout", require("../../controllers/auth/logout"));
router.get("/verify_login", require("../../controllers/auth/verifyLogin"));
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  require("../../controllers/auth/googleCallback")
);

module.exports = router;
