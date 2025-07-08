const router = require("express").Router();

router.get("/all_users", require("../../controllers/admin/allUsers"));
router.post("/add_user", require("../../controllers/admin/addUser"));

module.exports = router;
