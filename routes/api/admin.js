const router = require("express").Router();

router.get("/all_users", require("../../controllers/admin/allUsers"));
router.post("/add_user", require("../../controllers/admin/addUser"));

router.post("/add_league", require("../../controllers/admin/addLeague"));

module.exports = router;
