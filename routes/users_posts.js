const dbconnection = require('../db.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
var express = require('express');
var router = express.Router({ mergeParams: true });
const { isAuthenticated } = require('../middleware.js');
const supabase = require('../supabase.js');

// GET all posts for user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.payload.id;
  if (isNaN(userId)) return res.status(400).json({ error: 'wrong userId' });

  try {
    const [rows] = await dbconnection.query('SELECT * FROM POSTS WHERE user_id=?', [userId]);

    // generate signed URLs for each post with pic
    for (let post of rows) {
      if (post.pic) {
        const { data, error } = await supabase.storage
          .from('posts_bucket') // your bucket name
          .createSignedUrl(post.pic, 3600);

        if (!error && data?.signedUrl) post.pic = data.signedUrl;
        else post.pic = null;
      }
    }

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

// GET single post by postId
router.get('/:postId', isAuthenticated, async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = req.payload.id;
  if (isNaN(postId) || isNaN(userId)) return res.status(400).json({ error: 'wrong parameters' });

  try {
    const [rows] = await dbconnection.query('SELECT * FROM POSTS WHERE id=? AND user_id=?', [postId, userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });

    const post = rows[0];
    if (post.pic) {
      const { data, error } = await supabase.storage
        .from('posts_bucket')
        .createSignedUrl(post.pic, 3600);

      if (!error && data?.signedUrl) post.pic = data.signedUrl;
      else post.pic = null;
    }

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

// POST create a new post
router.post('/', isAuthenticated, upload.single('pic'), async (req, res) => {
  const userId = req.payload.id;
  const caption = req.body.caption || '';
  if (isNaN(userId)) return res.status(400).json({ error: 'wrong userId' });

  let picPath = null;

  try {
    // handle pic upload if file provided
    if (req.file) {
      const fileName = `post_${userId}_${Date.now()}.png`; // unique name
      picPath = fileName;

      const { data, error } = await supabase.storage
        .from('posts_bucket')
        .upload(picPath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error) return res.status(500).json({ error: 'Failed to upload image', details: error });
    }

    const query = 'INSERT INTO POSTS (user_id, pic, caption) VALUES (?, ?, ?)';
    const [rows] = await dbconnection.query(query, [userId, picPath, caption]);

    // return inserted post with signed URL
    let newPost = { id: rows.insertId, user_id: userId, pic: picPath, caption };
    if (picPath) {
      const { data } = await supabase.storage.from('posts_bucket').createSignedUrl(picPath, 3600);
      newPost.pic = data?.signedUrl || null;
    }

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

// DELETE post
router.delete('/:postId', isAuthenticated, async (req, res) => {
  const postId = parseInt(req.params.postId);
  const userId = req.payload.id;
  if (isNaN(postId) || isNaN(userId)) return res.status(400).json({ error: 'wrong parameters' });

  try {
    // delete post
    const [rows] = await dbconnection.query('DELETE FROM POSTS WHERE user_id=? AND id=?', [userId, postId]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

module.exports = router;