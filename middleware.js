const jwt= require('jsonwebtoken');
require('dotenv').config();
function isAuthenticated(req,res,next){
    const {authorization}=req.headers;
    console.log(req.headers);
    if(!authorization){
        return res.status(401).json({
            error:"unauthorized"
        })
    }
    else { 
        try{
            const token=authorization.split(' ')[1];
            const payload=jwt.verify(token,process.env.JWT_ACCESS_SECRET);
            console.log(payload);
            req.payload=payload;
        }
        catch (err){
            if(err.name==='TokenExpiredError'){
            return res.status(401).json({error:err.name});}
            else {
                return res.status(401).json({error:"Unauthorized"});
            }
        }
        return next();
    }
}

module.exports={isAuthenticated};