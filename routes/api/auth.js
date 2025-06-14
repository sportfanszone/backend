const router = require("express").Router();

router.post("/signup", require("../../controllers/auth/signup"));
router.post("/verify_otp", require("../../controllers/auth/verifyOtp"));
router.post("/resend_otp", require("../../controllers/auth/resendOtp"));
router.post("/login", require("../../controllers/auth/login"));
router.post("/logout", require("../../controllers/auth/logout"));
router.get("/verify_login", require("../../controllers/auth/verifyLogin"));

module.exports = router;
