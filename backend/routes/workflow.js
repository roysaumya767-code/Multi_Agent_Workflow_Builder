const {Router} = require("express");
const router = Router();
const {addToQueque,getJobStatus} = require("../job");


router.post("/workflow",addToQueque);
router.get("/:jobId",getJobStatus);

module.exports = router;
