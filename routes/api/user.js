const router = require("express").Router();

router.get("/dashboard", require("../../controllers/user/dashboard"));
router.get("/get_user", require("../../controllers/user/getUser"));
router.post("/create_post", require("../../controllers/user/createPost"));

module.exports = router;
