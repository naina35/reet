const mysql=require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.host,
  user: 'root',
  password: '2004',
  database: 'heer'
})
connection.connect((err=>{
  if(err)throw err;
  console.log("mysql connected")
}));
module.exports=connection;