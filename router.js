const { InsertUser, LoginUser } = require("./Controller/UsersController");

const router = require("express").Router();

router.post("/register", InsertUser);
router.post("/login", LoginUser);
module.exports = router;
