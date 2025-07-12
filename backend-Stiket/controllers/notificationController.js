const { pool } = require('../config/database');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await pool.execute(`
            SELECT id, type, message, is_read, related_id, created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 50
        `, [userId]);

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching notifications'
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating notification'
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );

        res.json({
            success: true,
            data: { count: result[0].count }
        });
    } catch (error) {
        console.error('Unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting unread count'
        });
    }
};

module.exports = { getNotifications, markAsRead, getUnreadCount };