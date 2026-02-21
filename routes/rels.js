const dbconnection=require('../db.js');
const {isAuthenticated}=require('../middleware.js');
var express=require('express');
var router=express.Router();

//get pending requests u sent or people sent u 
//get people following u
//get people u follow
//post new follow requests
//change rel :
//people who u follow - u can unfollow them
// people who follow u- remove them from follow
//pending request to follow or remove request

/**
 * make a new follow request:
 * post: /users/me/rels/
 * get list of people u follow
 */
/*
  rels table convention:
    user1 =  (follower / sender of request)
    user2 =     (followed / receiver of request)
  type:
    'pending' = follow request sent, not yet accepted
    'follow'  = confirmed follow relationship
*/

// GET /rels/followers        — people who follow you (user2 = me, type = 'follow')
router.get('/followers', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    try {
        const query = `
            SELECT u.id, u.username, u.bio, u.pfp
            FROM rels r
            JOIN users u ON u.id = r.user1
            WHERE r.user2 = ? AND r.type = 'follow'
        `;
        const [rows] = await dbconnection.query(query, [userId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// GET /rels/following        — people you follow (user1 = me, type = 'follow')
router.get('/following', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    try {
        const query = `
            SELECT u.id, u.username, u.bio, u.pfp
            FROM rels r
            JOIN users u ON u.id = r.user2
            WHERE r.user1 = ? AND r.type = 'follow'
        `;
        const [rows] = await dbconnection.query(query, [userId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// GET /rels/pending/sent     — pending requests you sent (user1 = me, type = 'pending')
router.get('/pending/sent', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    try {
        const query = `
            SELECT u.id, u.username, u.bio, u.pfp
            FROM rels r
            JOIN users u ON u.id = r.user2
            WHERE r.user1 = ? AND r.type = 'pending'
        `;
        const [rows] = await dbconnection.query(query, [userId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// GET /rels/pending/received — pending requests sent to you (user2 = me, type = 'pending')
router.get('/pending/received', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    console.log(userId);
    try {
        const query = `
            SELECT u.id, u.username, u.bio, u.pfp
            FROM rels r
            JOIN users u ON u.id = r.user1
            WHERE r.user2 = ? AND r.type = 'pending'
        `;
        const [rows] = await dbconnection.query(query, [userId]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// POST /rels/:targetId       — send a follow request to targetId (creates 'pending')
router.post('/:targetId', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const targetId = parseInt(req.params.targetId);

    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid target user id' });
    if (userId === targetId) return res.status(400).json({ error: 'You cannot follow yourself' });

    try {
        // check if a rel already exists in either direction
        const checkQuery = `
            SELECT * FROM rels
            WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)
        `;
        const [existing] = await dbconnection.query(checkQuery, [userId, targetId, targetId, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Relationship already exists' });
        }

        const query = 'INSERT INTO rels (user1, user2, type) VALUES (?, ?, ?)';
        const [result] = await dbconnection.query(query, [userId, targetId, 'pending']);
        return res.json({ message: 'Follow request sent', id: result.insertId });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// PATCH /rels/:requesterId/accept  — accept a pending request someone sent you
//   (user1 = requesterId, user2 = me, type = 'pending' → 'follow')
router.patch('/:requesterId/accept', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const requesterId = parseInt(req.params.requesterId);

    if (isNaN(requesterId)) return res.status(400).json({ error: 'Invalid requester id' });

    try {
        const query = `
            UPDATE rels SET type = 'follow'
            WHERE user1 = ? AND user2 = ? AND type = 'pending'
        `;
        const [result] = await dbconnection.query(query, [requesterId, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No such pending request found' });
        return res.json({ message: 'Follow request accepted' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// DELETE /rels/:targetId/unfollow  — unfollow someone you follow (user1 = me, user2 = target)
router.delete('/:targetId/unfollow', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const targetId = parseInt(req.params.targetId);

    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid target id' });

    try {
        const query = `DELETE FROM rels WHERE user1 = ? AND user2 = ? AND type = 'follow'`;
        const [result] = await dbconnection.query(query, [userId, targetId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'You do not follow this user' });
        return res.json({ message: 'Unfollowed successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// DELETE /rels/:followerId/remove  — remove someone who follows you (user1 = followerId, user2 = me)
router.delete('/:followerId/remove', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const followerId = parseInt(req.params.followerId);

    if (isNaN(followerId)) return res.status(400).json({ error: 'Invalid follower id' });

    try {
        const query = `DELETE FROM rels WHERE user1 = ? AND user2 = ? AND type = 'follow'`;
        const [result] = await dbconnection.query(query, [followerId, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'This user does not follow you' });
        return res.json({ message: 'Follower removed successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// DELETE /rels/:targetId/cancel    — cancel a pending request you sent (user1 = me, user2 = target)
router.delete('/:targetId/cancel', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const targetId = parseInt(req.params.targetId);

    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid target id' });

    try {
        const query = `DELETE FROM rels WHERE user1 = ? AND user2 = ? AND type = 'pending'`;
        const [result] = await dbconnection.query(query, [userId, targetId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No pending request found' });
        return res.json({ message: 'Follow request cancelled' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

// DELETE /rels/:requesterId/reject — reject a pending request sent to you (user1 = requesterId, user2 = me)
router.delete('/:requesterId/reject', isAuthenticated, async (req, res) => {
    const userId = req.payload.id;
    const requesterId = parseInt(req.params.requesterId);

    if (isNaN(requesterId)) return res.status(400).json({ error: 'Invalid requester id' });

    try {
        const query = `DELETE FROM rels WHERE user1 = ? AND user2 = ? AND type = 'pending'`;
        const [result] = await dbconnection.query(query, [requesterId, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No pending request found' });
        return res.json({ message: 'Follow request rejected' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error', details: err });
    }
});

module.exports = router;