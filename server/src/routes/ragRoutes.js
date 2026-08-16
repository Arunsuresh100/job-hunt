const express = require('express');
const router = express.Router();
const { getRecommendations, parseResume } = require('../controllers/ragController');

router.post('/recommendations', getRecommendations);
router.post('/parse-resume', parseResume);

module.exports = router;
