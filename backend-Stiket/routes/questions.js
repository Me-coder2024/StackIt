const express = require('express');
const { body } = require('express-validator');
const { createQuestion, getQuestions, getQuestion } = require('../controllers/questionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const questionValidation = [
    body('title').isLength({ min: 10, max: 200 }).trim().escape(),
    body('description').isLength({ min: 30 }).trim(),
    body('tags').isArray({ min: 1, max: 5 })
];

router.post('/', authenticateToken, questionValidation, createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestion);

module.exports = router;
