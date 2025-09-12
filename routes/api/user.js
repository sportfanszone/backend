const router = require("express").Router();

router.get("/dashboard", require("../../controllers/user/dashboard"));
router.get("/get_user", require("../../controllers/user/getUser"));
router.post("/create_post", require("../../controllers/user/createPost"));
router.post("/create_comment", require("../../controllers/user/createComment"));
router.get("/get_post/:postId", require("../../controllers/user/getPost"));
router.get(
  "/get_user_posts/:userId",
  require("../../controllers/user/getUserPosts")
);
router.get("/get_posts", require("../../controllers/user/getPosts"));
router.get(
  "/get_comment/:postId",
  require("../../controllers/user/getComment")
);
router.post("/create_share", require("../../controllers/user/createShare"));

router.post("/create_like", require("../../controllers/user/createLike"));

router.post(
  "/settings/update_personal_info",
  require("../../controllers/user/updatePersonalInfo")
);

module.exports = router;
