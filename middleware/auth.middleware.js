const jwt = require('jsonwebtoken');

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
        next();
      }
      else{
        next();
      }
    });
  }
  else{
    next();
  }
}
module.exports = {requireAuth, checkUser};