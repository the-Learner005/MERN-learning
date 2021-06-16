const jwt = require('jsonwebtoken');
const token_secret = 'pizza house secret';
const maxAge = 24 * 60 * 60;

module.exports.createToken = function(id, max_age) {
  // payload, secret, headers are auto applied
  return jwt.sign({ id }, token_secret, {
    expiresIn: max_age ? max_age : maxAge
  });
}

module.exports.validate_token = function(token){
  return jwt.verify(token, token_secret, (err, decodedToken) => {
    return err ? false : true;
  });
}