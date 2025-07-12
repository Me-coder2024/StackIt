const { pool } = require('../config/database');

const vote = async (req, res) => {
    try {
        const { type, voteType } = req.body; // type: 'question' or 'answer', voteType: 'upvote' or 'downvote'
        const itemId = req.params.id;
        const userId = req.user.id;

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check if user already voted
            const [existingVote] = await connection.execute(
                'SELECT id, vote_type FROM votes WHERE user_id = ? AND votable_type = ? AND votable_id = ?',
                [userId, type, itemId]
            );

            let voteChange = 0;

            if (existingVote.length > 0) {
                // User already voted
                if (existingVote[0].vote_type === voteType) {
                    // Remove vote (toggle)
                    await connection.execute(
                        'DELETE FROM votes WHERE id = ?',
                        [existingVote[0].id]
                    );
                    voteChange = voteType === 'upvote' ? -1 : 1;
                } else {
                    // Change vote
                    await connection.execute(
                        'UPDATE votes SET vote_type = ? WHERE id = ?',
                        [voteType, existingVote[0].id]
                    );
                    voteChange = voteType === 'upvote' ? 2 : -2;
                }
            } else {
                // New vote
                await connection.execute(
                    'INSERT INTO votes (user_id, votable_type, votable_id, vote_type) VALUES (?, ?, ?, ?)',
                    [userId, type, itemId, voteType]
                );
                voteChange = voteType === 'upvote' ? 1 : -1;
            }

            // Update vote count
            const table = type === 'question' ? 'questions' : 'answers';
            await connection.execute(
                `UPDATE ${table} SET votes = votes + ? WHERE id = ?`,
                [voteChange, itemId]
            );

            await connection.commit();
            connection.release();

            res.json({
                success: true,
                message: 'Vote recorded successfully'
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error recording vote'
        });
    }
};

module.exports = { vote };