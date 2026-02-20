//const { use } = require('react');
const dbconnection=require('../db.js')

const {hashToken}=require('../utils/hashToken.js');

async function addRefreshTokenToWhiteList(refreshToken,userId){
    
    //console.log("in whitelist function: ",refreshToken,userId);
    const hashedToken=hashToken(refreshToken);
    const sqlquery="INSERT INTO refs_user (user_id,token,expires_at) values(?,?,?)";

    const [result]=await dbconnection.execute(sqlquery,[userId,hashedToken,new Date(Date.now()+  1000 * 60 * 60 * 24 * 30)]);
    if(result.affectedRows===1)return result.insertId;
    else return null;
}

async function findRefreshToken(token){
    const hashedToken=hashToken(token);
    const sqlquery="SELECT * from refs_user where token=?";
    const [rows]=await dbconnection.execute(sqlquery,[hashedToken]);
    //console.log(rows,rows[0]);
    return rows[0];
}
async function deleteRefreshTokenById(id){
    const sqlquery="UPDATE refs_user SET revoked =true where id=?";
    const [result]=await dbconnection.execute(sqlquery,[id]);
    return result;
}
async function revokeTokens(userId){
    const sqlquery="UPDATE refs_user SET revoked =true where user_id=?";
    const [result]=await dbconnection.execute(sqlquery,[userId]);
    return result;
}
module.exports={
    revokeTokens,
    deleteRefreshTokenById,
    addRefreshTokenToWhiteList,
    findRefreshToken,
};