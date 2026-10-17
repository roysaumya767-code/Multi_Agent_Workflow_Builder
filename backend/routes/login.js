const {Router} = require("express");
const router = Router();
const {LoginUser} = require("../controllers/user");


router.post("/login",LoginUser);

module.exports = router;
