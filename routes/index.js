var express = require('express');
var router = express.Router();
const dbconnection=require('../db.js')
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
