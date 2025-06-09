const router = require("express").Router();

router.post("/signup", require("../../controllers/auth/signup"));

module.exports = router;
