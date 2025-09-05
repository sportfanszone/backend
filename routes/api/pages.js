const router = require("express").Router();
const { authenticate, authorizeRole } = require("../../middlewares/auth");

router.get("/topics", authenticate, require("../../controllers/pages/topics"));
router.get("/clubs", require("../../controllers/pages/clubs"));

module.exports = router;
