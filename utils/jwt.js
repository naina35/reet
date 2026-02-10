const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

//const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
//const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user) {
  console.log(process.env.JWT_ACCESS_SECRET);
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString('base64url');
  return token;
}

function generateTokens(user){
  const accessToken=generateAccessToken(user);
  const refreshToken= generateRefreshToken();
  return {accessToken,refreshToken};
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
