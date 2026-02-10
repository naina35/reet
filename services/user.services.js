const bcrypt=require('bcrypt');
//const { use } = require('react');
const dbconnection=require('../db.js')


async function findUserbyuname(username){
    const sqlquery="SELECT * from users where username=?";
    const [rows]=await dbconnection.execute(sqlquery,[username]);
    if(rows.length===0)return null;
    else return rows[0]; 
}
async function findUserbyId(id){
    const sqlquery="SELECT * from users where id=?";
    const [rows]=await dbconnection.execute(sqlquery,[id]);
    if(rows.length===0)return null;
    else return rows[0]; 
}
async function createUserByUsernamePassword(username,password){
    const hashedpasswd=bcrypt.hashSync(password,12);
    const sqlquery="INSERT INTO users (username,password) values(?,?)";
    const [result]=await dbconnection.execute(sqlquery,[username,hashedpasswd]);
    console.log(result);
    if(result.affectedRows===1)return result.insertId;
    else return null;
}

module.exports={
    findUserbyId,
    findUserbyuname,
    createUserByUsernamePassword,
};