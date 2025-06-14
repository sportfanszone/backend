const router = require("express").Router();

router.post("/signup", require("../../controllers/auth/signup"));
router.post("/verify_otp", require("../../controllers/auth/verifyOtp"));
router.post("/resend_otp", require("../../controllers/auth/resendOtp"));

module.exports = router;
