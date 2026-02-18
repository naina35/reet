const dbconnection=require('../db.js')
var express = require('express');
var router = express.Router({mergeParams:true});
// /users/:userId/posts 
const  {isAuthenticated}=require('../middleware.js');
router.get('/',isAuthenticated,async(req,res)=>{
    const userId=req.payload.id;
    if(isNaN(userId)){
      return res.status(400).json({ error: 'wrong userId'});
    }
    else {
        const query='SELECT * from POSTS where user_Id=?'
        try{
            const [rows]=await dbconnection.query(query,userId,(err,rows,fields)=>{
            res.json(rows);
        })}
        catch(err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
    }
});
/* 
POSTS
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
user_id INT not null,
pic varchar(255) ,
caption text ,
FOREIGN KEY (user_id) REFERENCES USERS(id)
 */
router.post('/',isAuthenticated,async(req,res)=>{
    console.log("users_posts.js post request")
    const {pic,caption}=req.body;
    const userId=req.payload.id;
    console.log(pic,caption,userId);
    if(isNaN(userId)) return res.status(400).json({error:"wrong user Id"});
    else {
        try {
    const query = "INSERT INTO POSTS (user_id,pic,caption) values (?,?,?)";
    const [rows] = await dbconnection.query(query, [userId, pic, caption]);

    return res.json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error", details: err });
  }
    }
})
router.get('/:postId',isAuthenticated,async(req,res)=>{
    const postId=parseInt(req.params.postId);
    const userId=req.payload.id;
    if (isNaN(postId)||isNaN(userId)){
        return res.status(500).json({error:"wrong post Id"});
    }
    else{ 
        try{
            const sqlquery="SELECT * from posts where id=? and user_Id=?";
            const [rows]=await dbconnection.query(sqlquery,[postId,userId])
            if(rows.length===0){
            return res.status(500).json({error:"No such row exists"});
            }
            else {
            return res.json(rows);
            }}
        catch(err){
            return res.status(500).json({ error: 'Database error', details: err });
        }
    }
});

router.delete('/:postId',isAuthenticated,async(req,res,next)=>{
    const postId=parseInt(req.params.postId);
    const userId=req.payload.id;
    if(isNaN(postId)||isNaN(userId)){
        return res.status(500).json({error:"parameters are wrong"});
    }
    const sqlquery="DELETE from posts where user_id=? and id=?";
    try{
    const [rows]=await dbconnection.query(sqlquery,[userId,postId])
            return res.json(rows);
    }catch(err){
            return res.status(500).json({error:"database error",details:err});
    }
}
);
module.exports=router