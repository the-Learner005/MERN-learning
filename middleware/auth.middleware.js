const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const tempUser = require('../models/tempusers.model');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; 
  if(token){
    jwt.verify(token, 'pizza house secret', (err, decodedToken) => {
      if(err){
        res.redirect('/login');
      }
      else{
        if(req.url == '/login' || req.url == '/signup'){
          res.redirect('/');
        }
        else{
          next();
        }
       
      }
    });
  }
  else{
    res.redirect('/login');
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'pizza house secret', async (err, decodedToken) => {
      if(err){
        res.locals.user = null;
        next();
      }
      else{
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  }
  else{
    res.locals.user = null;
    next();
  }
}
module.exports = {requireAuth, checkUser};