const router = require("express").Router();

router.get("/all_users", require("../../controllers/admin/allUsers"));

module.exports = router;
