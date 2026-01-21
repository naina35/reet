const dbconnection=require('../db.js')

var express = require('express');
var router = express.Router({mergeParams:true});
// /users/:userId/posts 
router.get('/',(req,res)=>{
    const userId=parseInt(req.params.userId);
    if(isNaN(userId)){
      return res.status(400).json({ error: 'wrong userId'});
    }
    else {
        const query='SELECT * from POSTS where user_Id=?'
        dbconnection.query(query,userId,(err,rows,fields)=>{
            if(err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            else res.json(rows);
        })
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
router.post('/',(req,res)=>{
    console.log("users_posts.js post request")
    const {pic,caption}=req.body;
    const userId=parseInt(req.params.userId);
    if(isNaN(userId)) return res.status(400).json({error:"wrong user Id"});
    else {
        const query="INSERT INTO POSTS (user_id,pic,caption) values (?,?,?)";
        dbconnection.query(query,[userId,pic,caption],(err,rows,fields)=>{
            if(err){
                return res.status(500).json({ error: 'Database error', details: err });
            }
            else {
                return res.json(rows);
            }
    });
    }
})
router.get('/:postId',(req,res)=>{
    const postId=parseInt(req.params.postId);
    const userId=parseInt(req.params.userId);
    if (isNaN(postId)||isNaN(userId)){
        return res.status(500).json({error:"wrong post Id"});
    }
    const sqlquery="SELECT * from posts where id=? and user_Id=?";
    dbconnection.query(sqlquery,[postId,userId],(err,rows,fields)=>{
        if(err){
            return res.status(500).json({ error: 'Database error', details: err });
        }
        else if(rows.length===0){
            return res.status(500).json({error:"No such row exists"});
        }
        else {
            return res.json(rows);
        }
    })
});

router.delete('/:postId',(req,res,next)=>{
    const postId=parseInt(req.params.postId);
    const userId=parseInt(req.params.userId);
    if(isNaN(postId)||isNaN(userId)){
        return res.status(500).json({error:"parameters are wrong"});
    }
    const sqlquery="DELETE from posts where user_id=? and id=?";
    dbconnection.query(sqlquery,[userId,postId],(err,rows,fields)=>{
        if(err){
            return res.status(500).json({error:"database error",details:err});
        }
        else {
            return res.json(rows);
        }
    });
})
module.exports=router