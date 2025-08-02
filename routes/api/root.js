const router = require("express").Router();

router.get("/get_leagues", require("../../controllers/root/getLeagues"));
router.get(
  "/get_top_conversations",
  require("../../controllers/root/getTopConversations")
);

module.exports = router;
