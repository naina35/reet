//const { use } = require('react');
const dbconnection=require('../../db.js')


var express=require('express');
var router=express.Router();
const bcrypt=require('bcrypt');
const {
    revokeTokens,
    addRefreshTokenToWhiteList,
    findRefreshToken,
    deleteRefreshTokenById,
}= require('../../services/auth.services.js');
const {
    findUserbyId,
    findUserbyuname,
    createUserByUsernamePassword,
} =require('../../services/user.services.js');
const {generateTokens}= require('../../utils/jwt.js')

router.post('/auth/register',
    async(req,res,next)=>{
        const {username,password}=req.body;
        if(!username|| !password) {
            return res.status(400).json({error:"missing details"});
        }
        else {
            next();
        }
    },  
    async (req,res,next)=>{
        //existing username check
        const {username,password}=req.body;
        const existingUser=await findUserbyuname(username);
        if(existingUser){
            return res.status(400).json({error:"duplicate username"});
        }
        else{
            const userId=await createUserByUsernamePassword(username,password);
            if(!userId)return res.status(400).json({error:"try again later"});
            else{
                const {accessToken,refreshToken}=generateTokens({id:userId,username});
                await addRefreshTokenToWhiteList(refreshToken,userId);
                res.json({
                    accessToken,
                    refreshToken,
                });
            }
        }
    })

module.exports=router;

