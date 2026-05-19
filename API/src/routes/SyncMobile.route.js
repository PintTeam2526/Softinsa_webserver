var express = require('express');
var router = express.Router();
var controllerSyncMobile = require('../controllers/SyncMobile.controller');
var authVerification = require('../middleware/requireAuth.middleware');

router.get('/servicelines', controllerSyncMobile.syncServiceLinesMobile);
router.get('/areas', controllerSyncMobile.syncAreasMobile);
router.get('/learningpaths', controllerSyncMobile.syncLearningPathsMobile);
router.get('/badges', controllerSyncMobile.syncBadgesMobile);
router.get('/estados', controllerSyncMobile.syncEstadosMobile);

module.exports = router;