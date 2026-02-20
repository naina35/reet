//const { use } = require('react');
const dbconnection=require('../db.js')
const {isAuthenticated}=require('../middleware.js');
var express = require('express');
var router = express.Router();

router.post('/',async(req,res,next)=>{
  const {username,password,bio,pfp}=req.body;
  console.log(req.body);
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
router.get('/profile',isAuthenticated,async(req,res)=>{
    const userId=req.payload.id;
    if(isNaN(userId)){
      return res.status(400).json({ error: 'wrong userId'});
    }
    try{
    const [rows]=await dbconnection.query('SELECT username,bio,pfp from USERS where Id=?',userId);
    if(rows.length===0)res.status(500).json({ error: 'no userId exists', details: err });
      res.json(rows);}
      catch(err) {
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

router.patch('/profile',isAuthenticated,async(req,res,next)=>{
  const userId=req.payload.id;
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
    try{
    const [rows]=dbconnection.query(sql_query,[new_bio,userId])
    return res.json(rows);}
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
      
    }
  else if(req.body.bio===undefined){
    const new_pfp=req.body.pfp;
    const sql_query="ALTER USERS SET pfp=? where id=?";
    try{
    const [rows]=await dbconnection.query(sql_query,[new_pfp,userId])
    return res.json(rows);}
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
  }
  else {
    const new_pfp=req.body.pfp;
    const new_bio=req.body.bio;
    const sql_query="ALTER USERS SET pfp=?,bio=? where id=?";
    try{
    const [rows]=await dbconnection.query(sql_query,[new_pfp,new_bio,userId]);
    return res.json(rows);
      }
      catch(err){
        return res.status(500).json({err:"database error",details:err});
      }
}});
module.exports = router;
