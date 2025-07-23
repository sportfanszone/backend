const router = require("express").Router();

router.get("/all_users", require("../../controllers/admin/allUsers"));
router.post("/add_user", require("../../controllers/admin/addUser"));
router.post("/edit_user/:id", require("../../controllers/admin/editUser"));

router.get("/all_leagues", require("../../controllers/admin/allLeagues"));
router.post("/add_league", require("../../controllers/admin/addLeague"));

router.get("/all_clubs", require("../../controllers/admin/allClubs"));
router.post("/add_club", require("../../controllers/admin/addClub"));

module.exports = router;
