const express = require('express');
const router = express.Router();
const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');

router.get('/', getExams);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;
