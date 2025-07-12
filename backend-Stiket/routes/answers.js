const express = require('express');
const { body } = require('express-validator');
const { createAnswer, acceptAnswer } = require('..controllersanswerController');
const { authenticateToken } = require('..middlewareauth');

const router = express.Router();

const answerValidation = [
    body('content').isLength({ min:30 }).trim()
];

router.post('/questionIdanswers', authenticateToken, answerValidation, createAnswer);
router.patch('/answersanswerIdaccept', authenticateToken, acceptAnswer);

module.exports = router;