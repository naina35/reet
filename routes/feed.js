var express = require('express');
var router = express.Router();
const {isAuthenticated}=require('../middleware')
const dbconnection=require('../db.js')
const supabase=require('../supabase.js')
router.get('/feed', isAuthenticated, async (req, res) => {
  //console.log("user feed api");

  const currentUserId = req.payload.id;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

  try {
    let query = `
      SELECT 
        p.id,
        p.user_id,
        p.pic,
        p.caption,
        u.username,
        u.pfp
      FROM POSTS p
      JOIN rels r ON r.user2 = p.user_id
      JOIN USERS u ON u.id = p.user_id
      WHERE r.user1 = ?
        AND r.type = 'follow'
    `;

    const params = [currentUserId];

    if (cursor) {
      query += ' AND p.id < ?';
      params.push(cursor);
    }

    query += ` ORDER BY p.id DESC LIMIT ${limit}`;

    const [posts] = await dbconnection.query(query, params);
    //console.log("posts fetched:", posts.length);

    // Generate signed URLs
    for (let post of posts) {
      if (post.pic) {
        const { data, error } = await supabase.storage
          .from('posts_bucket')
          .createSignedUrl(post.pic, 3600);

        post.pic = (!error && data?.signedUrl) ? data.signedUrl : null;
      }

      if (post.pfp) {
        const { data, error } = await supabase.storage
          .from('pfp_bucker')
          .createSignedUrl(post.pfp, 3600);

        post.pfp = (!error && data?.signedUrl) ? data.signedUrl : null;
      }
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return res.json({
      posts,
      pagination: { limit, nextCursor },
    });

  } catch (err) {
    //console.error("Error in /feed:", err);
    return res.status(500).json({ error: 'Database error', details: err });
  }
});
module.exports=router;