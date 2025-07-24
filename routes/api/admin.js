const router = require("express").Router();

router.get("/all_users", require("../../controllers/admin/allUsers"));
router.post("/add_user", require("../../controllers/admin/addUser"));
router.post("/edit_user/:id", require("../../controllers/admin/editUser"));
router.post(
  "/reset_user_password/:id",
  require("../../controllers/admin/resetUserPassword")
);
router.post(
  "/toggle_user_status/:id",
  require("../../controllers/admin/toggleUserStatus")
);
router.post("/delete_user/:id", require("../../controllers/admin/deleteUser"));

router.get("/all_leagues", require("../../controllers/admin/allLeagues"));
router.post("/add_league", require("../../controllers/admin/addLeague"));
router.post("/edit_league/:id", require("../../controllers/admin/editLeague"));

router.get("/all_clubs", require("../../controllers/admin/allClubs"));
router.post("/add_club", require("../../controllers/admin/addClub"));

module.exports = router;
