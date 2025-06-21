const router = require("express").Router();

router.get("/getLeagues", require("../../controllers/root/getLeagues"));

module.exports = router;
