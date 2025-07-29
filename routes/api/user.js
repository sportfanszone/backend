const router = require("express").Router();

router.get("/dashboard", require("../../controllers/user/dashboard"));
router.get("/get_user", require("../../controllers/user/getUser"));
router.post("/create_post", require("../../controllers/user/createPost"));
router.post("/create_comment", require("../../controllers/user/createComment"));
router.get("/get_post/:postId", require("../../controllers/user/getPost"));

module.exports = router;
