const express = require('express');
const router = express.Router();
const { getJobs, syncJobs } = require('../controllers/jobController');

router.get('/', getJobs);
router.post('/sync', syncJobs);

module.exports = router;
