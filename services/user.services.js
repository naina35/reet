const bcrypt=require('bcrypt');
//const { use } = require('react');
const dbconnection=require('../db.js')


async function findUserbyuname(username){
    const sqlquery="SELECT * from USERS where username=?";
    const [rows]=await dbconnection.execute(sqlquery,[username]);
    if(rows.length===0)return null;
    else return rows[0]; 
}
async function findUserbyId(id){
    const sqlquery="SELECT * from USERS where id=?";
    const [rows]=await dbconnection.execute(sqlquery,[id]);
    console.log(rows);
    if(rows.length===0)return null;
    else return rows[0]; 
}
async function createUserByUsernamePassword(username,password){
    const hashedpasswd=bcrypt.hashSync(password,12);
    const sqlquery="INSERT INTO USERS (username,PASSWORD) values(?,?)";
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