const mysql=require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
    ssl: {
    rejectUnauthorized: false
  }
})
// connection.connect((err=>{
//   if(err)throw err;
//   console.log("mysql connected")
// }));
module.exports=connection;