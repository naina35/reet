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
router.post('/refreshToken',async (req,res,next)=>{
    const {refreshToken}=req.body;
    if(!refreshToken){
        res.status(400).json({error:"Missing ref token"});
    }
    else {
        const savedRefreshToken=await findRefreshToken(refreshToken);
        if(!savedRefreshToken||savedRefreshToken.revoked===true|| Date.now()>=savedRefreshToken.expires_at.getTime()){
            res.status(401).json({error:"unauthorized"});

        }
        else {
            const user= await findUserbyId(savedRefreshToken.user_id);
            if(!user){
                res.status(401).json({error:"unauthorized"});
            }
            else {
                await deleteRefreshTokenById(savedRefreshToken.id);
                const {accessToken,refreshToken:newRefToken}=generateTokens(user.id);
                await addRefreshTokenToWhiteList(newRefToken,user.id);

                res.json({
                    accessToken,
                    refreshToken:newRefToken,
                })
            }
        }
    }
});

module.exports=router;