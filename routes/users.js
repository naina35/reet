//const { use } = require('react');
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const dbconnection=require('../db.js')
const {isAuthenticated}=require('../middleware.js');
var express = require('express');
var router = express.Router();
const supabase=require('../supabase.js')
const {findUserbyuname}=require('../services/user.services.js')
router.post('/',async(req,res,next)=>{
  const {username,password,bio,pfp}=req.body;
  //console.log(req.body);
  if(!username||!password){
    return res.status(400).json({ error: 'no username / password' });
  }
  const query='INSERT INTO USERS (username,password,bio,pfp) values(?,?,?,?)';  
  try{
  const [rows]=await dbconnection.query(query,[username,password,bio,pfp]);
    res.status(201).json({ userId: rows.insertId})}
    catch(err) {
      res.status(400).json({error:err.details})
    }
  
});
router.get('/rel/:username', isAuthenticated, async (req, res) => {
  console.log("user profile page api");

  const currentUserId = req.payload.id;
  const requestedUsername = req.params.username;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
  console.log(cursor)
  try {
    const requestedUser = await findUserbyuname(requestedUsername);
    console.log("requestedUser:", requestedUser);

    if (!requestedUser) return res.status(404).json({ error: 'User not found' });

    const [relRows] = await dbconnection.execute(
      "SELECT 1 FROM rels WHERE user1=? AND user2=? AND type='follow'",
      [currentUserId, requestedUser.id]
    );
    console.log("relRows:", relRows);

    if (relRows.length === 0) {
      return res.status(403).json({ error: 'You are not following this user' });
    }

    let query = 'SELECT id, pic, caption FROM POSTS WHERE user_id=?';
    const params = [requestedUser.id];
    if (cursor) {
      query += ' AND id < ?';
      params.push(cursor);
    }
    query += ' ORDER BY id DESC LIMIT ?';
    params.push(limit);
    console.log(params)
    const [posts] = await dbconnection.query(query,params);
    console.log("posts fetched:", posts.length);

    for (let post of posts) {
      if (post.pic) {
        const { data, error } = await supabase.storage
          .from('posts_bucket')
          .createSignedUrl(post.pic, 3600);

        if (!error && data?.signedUrl) post.pic = data.signedUrl;
        else post.pic = null;
      }
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return res.json({
      user: {
        id: requestedUser.id,
        username: requestedUser.username,
        bio: requestedUser.bio,
        pfp: requestedUser.pfp
      },
      posts,
      pagination: { limit, nextCursor },
    });

  } catch (err) {
    console.error("Error in /users/:username:", err);
    return res.status(500).json({ error: 'Database error', details: err });
  }
});
router.get('/profile', isAuthenticated, async (req, res) => {
  const userId = req.payload.id;
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'wrong userId' });
  }

  try {
    const [rows] = await dbconnection.query(
      'SELECT username, bio, pfp FROM USERS WHERE id=?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No user found with this ID' });
    }

    const user = rows[0];

    // if user has a pfp stored, generate signed URL
    if (user.pfp) {
      console.log("user has pfp")
      const { data: signedURL, error } = await supabase.storage
        .from('pfp_bucker')      
        .createSignedUrl(user.pfp, 3600); // URL valid for 60 seconds

      if (error) {
        console.log('Error generating signed URL:', error);
        user.pfp = null; // fallback if error
      } else {
        console.log(signedURL)
        user.pfp = signedURL.signedUrl;
      }
    }
    console.log(user)
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});
router.delete('/profile',isAuthenticated,async(req,res,next)=>{
    const userId=req.payload.id;
    if(isNaN(userId)){
        return res.status(500).json({error:"userId are wrong"});
    }
    const sqlquery="DELETE from USERS where id=?";
    try{
    const [rows]=await dbconnection.query(sqlquery,userId)
    return res.json(rows);}
        catch(err){
            return res.status(500).json({error:"database error",details:err});
        }
        
  });

router.patch('/profile', isAuthenticated, upload.single('pfp'), async (req, res, next) => {
  const userId=req.payload.id;
  if(isNaN(userId)){
    return res.status(500).json({error:"wrong user Id"});
  }
  
  console.log(req.body)
  console.log(req.file)
  if(req.file===undefined&&req.body.bio===undefined){
    return res.status(500).json({error:"Nothing to update"});
  }
  
  if(req.file===undefined){
    const new_bio=req.body.bio;
    const sql_query="UPDATE USERS SET bio=? where id=?";
    const sql_query2="SELECT username,bio,pfp from USERS where id=?"
    try{
    const [rows]=await dbconnection.query(sql_query,[new_bio,userId])
    const [rows2]=await dbconnection.query(sql_query2,userId)
    return res.json(rows2[0]);
  }
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
      
    }
  else if(req.body.bio===undefined){
    const new_pfp=req.file;
    const fileName = `pfp_${userId}.png`; // unique per user
    const { data, error } = await supabase.storage.from('pfp_bucker')
  .upload(fileName, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: true, // overwrite if already exists
  });

if (error) {
  return res.status(500).json({ error: 'Failed to upload image', details: error });
}
const filePath =fileName;
    const sql_query="UPDATE USERS SET pfp=? where id=?";
    const sql_query2="SELECT username,bio,pfp from USERS where id=?"
    try{
    const [rows]=await dbconnection.query(sql_query,[filePath,userId])
    const [rows2]=await dbconnection.query(sql_query2,userId)
    return res.json(rows2[0]);
    }
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
  }
  else {
    const new_pfp=req.body.pfp;
    const new_bio=req.body.bio;
    const sql_query="UPDATE USERS SET pfp=?,bio=? where id=?";
    const sql_query2="SELECT username,bio,pfp from USERS where id=?"
    try{
    const [rows]=await dbconnection.query(sql_query,[new_pfp,new_bio,userId]);
    const [rows2]=await dbconnection.query(sql_query2,userId)
    return res.json(rows2[0]);
      }
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
}});
module.exports = router;
