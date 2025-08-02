const router = require("express").Router();

router.get("/get_leagues", require("../../controllers/root/getLeagues"));
router.get(
  "/get_top_conversations",
  require("../../controllers/root/getTopConversations")
);
router.get(
  "/get_trending_posts",
  require("../../controllers/root/getTrendingPosts")
);

module.exports = router;
