const { use } = require('react');
const dbconnection=require('../db.js')

var express = require('express');
var router = express.Router();

router.post('/',(req,res,next)=>{
  const {username,password,bio,pfp}=req.body;
  console.log(req.body);
  if(!username||!password){
    return res.status(400).json({ error: 'no username / password' });
  }
  const query='INSERT INTO USERS (username,password,bio,pfp) values(?,?,?,?)';  
  dbconnection.query(query,[username,password,bio,pfp],(err,rows,fields)=>{
    if(err) {
      res.status(400).json({error:err.details})
    }
    else res.status(201).json({ userId: rows.insertId})
  })
  
});
router.get('/:userId',(req,res)=>{
    const userId=parseInt(req.params.userId);
    if(isNaN(userId)){
      return res.status(400).json({ error: 'wrong userId'});
    }
    dbconnection.query('SELECT * from users where Id=?',userId,(err,rows,fields)=>{
      if(err) {
        return res.status(500).json({ error: 'Database error', details: err });
      }
      if(rows.length===0)res.status(500).json({ error: 'no userId exists', details: err });
      res.json(rows);
    });
});


router.delete('/:userId',(req,res,next)=>{
    const userId=parseInt(req.params.userId);
    if(isNaN(userId)){
        return res.status(500).json({error:"userId are wrong"});
    }
    const sqlquery="DELETE from users where id=?";
    dbconnection.query(sqlquery,userId,(err,rows,fields)=>{
        if(err){
            return res.status(500).json({error:"database error",details:err});
        }
        else {
            return res.json(rows);
        }
    });
})

router.patch('/:userId',(req,res,next)=>{
  const userId=parseInt(req.params.userId);
  if(isNaN(userId)){
    return res.status(500).json({error:"wrong user Id"});
  }
  // allowed fields are bio and pfp and also password
  if(req.body.pfp===undefined&&req.body.bio===undefined){
    return res.status(500).err("Nothing to update");
  }
  
  if(req.body.pfp===undefined){
    const new_bio=req.body.bio;
    const sql_query="ALTER USERS SET bio=? where id=?";
    dbconnection.query(sql_query,[new_bio,userId],(err,rows,fields)=>{
      if(err){
        return res.status(500).json({err:"database error",details:err});
      }
      else {
        return res.json(rows);
      }
    })
  }
  else if(req.body.bio===undefined){
    const new_pfp=req.body.pfp;
    const sql_query="ALTER USERS SET pfp=? where id=?";
    dbconnection.query(sql_query,[new_pfp,userId],(err,rows,fields)=>{
      if(err){
        return res.status(500).json({err:"database error",details:err});
      }
      else {
        return res.json(rows);
      }
    })
  }
  else {
    const new_pfp=req.body.pfp;
    const new_bio=req.body.bio;
    const sql_query="ALTER USERS SET pfp=?,bio=? where id=?";
    dbconnection.query(sql_query,[new_pfp,new_bio,userId],(err,rows,fields)=>{
      if(err){
        return res.status(500).json({err:"database error",details:err});
      }
      else {
        return res.json(rows);
      }
    })
  }
});
module.exports = router;
