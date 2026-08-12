const express = require('express');
const router = express.Router();
const { getSavedItems, toggleSaveItem } = require('../controllers/savedController');

router.get('/', getSavedItems);
router.post('/toggle', toggleSaveItem);

module.exports = router;
