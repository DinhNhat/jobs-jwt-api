const express = require('express');
const router = express.Router();

const { getAllStudents, getAllStudentsStatic } = require('../controllers/students');

router.route('/').get(getAllStudents);
router.route('/static').get(getAllStudentsStatic);

module.exports = router;