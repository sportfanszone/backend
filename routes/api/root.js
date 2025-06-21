const router = require("express").Router();

router.get("/getLeagues", require("../../controllers/root/getLeagues"));
router.get("/topics", require("../../controllers/root/topics"));

module.exports = router;
