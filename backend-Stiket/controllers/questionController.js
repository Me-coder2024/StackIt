const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

const createQuestion = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, description, tags } = req.body;
        const userId = req.user.id;

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert question
            const [questionResult] = await connection.execute(
                'INSERT INTO questions (user_id, title, description) VALUES (?, ?, ?)',
                [userId, title, description]
            );

            const questionId = questionResult.insertId;

            // Handle tags
            if (tags && tags.length > 0) {
                for (const tagName of tags) {
                    // Get or create tag
                    const [existingTag] = await connection.execute(
                        'SELECT id FROM tags WHERE name = ?',
                        [tagName.toLowerCase()]
                    );

                    let tagId;
                    if (existingTag.length > 0) {
                        tagId = existingTag[0].id;
                    } else {
                        const [tagResult] = await connection.execute(
                            'INSERT INTO tags (name) VALUES (?)',
                            [tagName.toLowerCase()]
                        );
                        tagId = tagResult.insertId;
                    }

                    // Link question to tag
                    await connection.execute(
                        'INSERT INTO question_tags (question_id, tag_id) VALUES (?, ?)',
                        [questionId, tagId]
                    );
                }
            }

            await connection.commit();
            connection.release();

            res.status(201).json({
                success: true,
                message: 'Question created successfully',
                data: { id: questionId }
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Question creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating question'
        });
    }
};

const getQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const tag = req.query.tag || '';

        let query = `
            SELECT q.id, q.title, q.description, q.views, q.votes, q.created_at,
                   u.username as author, u.id as author_id,
                   COUNT(DISTINCT a.id) as answers_count,
                   GROUP_CONCAT(DISTINCT t.name) as tags
            FROM questions q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN answers a ON q.id = a.question_id
            LEFT JOIN question_tags qt ON q.id = qt.question_id
            LEFT JOIN tags t ON qt.tag_id = t.id
            WHERE 1=1
        `;

        const params = [];

        if (search) {
            query += ' AND (q.title LIKE ? OR q.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (tag) {
            query += ' AND t.name = ?';
            params.push(tag);
        }

        query += ` 
            GROUP BY q.id, q.title, q.description, q.views, q.votes, q.created_at, u.username, u.id
            ORDER BY q.created_at DESC
            LIMIT ? OFFSET ?
        `;
        params.push(limit, offset);

        const [questions] = await pool.execute(query, params);

        // Get total count
        let countQuery = `
            SELECT COUNT(DISTINCT q.id) as total
            FROM questions q
            LEFT JOIN question_tags qt ON q.id = qt.question_id
            LEFT JOIN tags t ON qt.tag_id = t.id
            WHERE 1=1
        `;

        const countParams = [];
        if (search) {
            countQuery += ' AND (q.title LIKE ? OR q.description LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }
        if (tag) {
            countQuery += ' AND t.name = ?';
            countParams.push(tag);
        }

        const [countResult] = await pool.execute(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: {
                questions: questions.map(q => ({
                    ...q,
                    tags: q.tags ? q.tags.split(',') : []
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Questions fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching questions'
        });
    }
};

const getQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;

        // Increment view count
        await pool.execute(
            'UPDATE questions SET views = views + 1 WHERE id = ?',
            [questionId]
        );

        // Get question details
        const [questions] = await pool.execute(`
            SELECT q.id, q.title, q.description, q.views, q.votes, q.created_at,
                   u.username as author, u.id as author_id,
                   GROUP_CONCAT(DISTINCT t.name) as tags
            FROM questions q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN question_tags qt ON q.id = qt.question_id
            LEFT JOIN tags t ON qt.tag_id = t.id
            WHERE q.id = ?
            GROUP BY q.id
        `, [questionId]);

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Get answers
        const [answers] = await pool.execute(`
            SELECT a.id, a.content, a.votes, a.is_accepted, a.created_at,
                   u.username as author, u.id as author_id
            FROM answers a
            JOIN users u ON a.user_id = u.id
            WHERE a.question_id = ?
            ORDER BY a.is_accepted DESC, a.votes DESC, a.created_at ASC
        `, [questionId]);

        const question = questions[0];
        question.tags = question.tags ? question.tags.split(',') : [];
        question.answers = answers;

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        console.error('Question fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching question'
        });
    }
};

module.exports = { createQuestion, getQuestions, getQuestion };