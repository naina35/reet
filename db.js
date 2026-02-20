const mysql=require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '2004',
  database: 'heer'
})
module.exports=connection;