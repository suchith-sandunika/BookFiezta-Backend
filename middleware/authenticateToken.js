const jwt = require('jsonwebtoken');
const SessionLog = require('../model/SessionLog');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if(!token) {
      return res.status(401).send('Access Denied. No token provided');
  } else {
      try {
          const decoded = jwt.verify(token, jwtSecret);
          req.user = decoded;

          // Check if the token exists in the SessionLogs ...
          const session = await SessionLog.find({token: token, logoutTime: null});
          console.log(session);
          if(!session) {
              return res.status(403).send('Invalid or expired session');
          } else {
              next();
          }
      } catch (error) {
          return res.status(403).send('Invalid token');
      }
  }
};

module.exports = authenticateToken;