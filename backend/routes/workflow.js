const {Router} = require("express");
const router = Router();
const {addToQueque} = require("../job");


router.post("/workflow",addToQueque);

module.exports = router;
