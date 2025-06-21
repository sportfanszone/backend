const router = require("express").Router();

router.get("/topics", require("../../controllers/pages/topics"));
router.get("/clubs", require("../../controllers/pages/clubs"));

module.exports = router;
