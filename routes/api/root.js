const router = require("express").Router();

router.get("/get_leagues", require("../../controllers/root/getLeagues"));

module.exports = router;
