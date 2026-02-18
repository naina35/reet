const bcrypt=require('bcrypt');
var express=require('express');
var router=express.Router();
const {
    findUserbyId,
    findUserbyuname,
    createUserByUsernamePassword,
} =require('../../services/user.services.js');
const {generateTokens}= require('../../utils/jwt.js')
const {
    revokeTokens,
    addRefreshTokenToWhiteList,
    findRefreshToken,
    deleteRefreshTokenById,
}= require('../../services/auth.services.js');
router.post('/auth/login',async (req,res,next)=>{
    const {username,password}=req.body;
    if(!username || !password){
        res.status(400).json({error:"u must provide username and password"});
    }
    else {
        const existingUser=await findUserbyuname(username);
        if(!existingUser){
            res.status(403).json({error:"u must provide correct username"});
        }
        else {
            const correctPswd= await bcrypt.compare(password,existingUser.PASSWORD);
            if(!correctPswd){
                res.status(403).json({error:"wrong password"});
            }
            else {
                    const { accessToken, refreshToken } = generateTokens({id:existingUser.id,username:username});
                    await addRefreshTokenToWhiteList(refreshToken, existingUser.id );

                    res.json({
                        accessToken,
                        refreshToken,
                    });

            }
        }
    }
})
module.exports=router;