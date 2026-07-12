const express = require("express");
const router = express.Router();
const mobileApkController = require("../controllers/mobileAPK.controller");

router.get("/downloadAPK", mobileApkController.downloadAPK);

module.exports = router;