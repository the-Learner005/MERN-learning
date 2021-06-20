const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');                                                                                                                
dotenv.config();
const token_secret = process.env.TOKEN_SECRET;

module.exports = {
  createToken: function(id, max_age) {
    return jwt.sign({ id }, token_secret, {
      expiresIn: max_age ? max_age : process.env.TOKEN_EXPIRY_TIME
    });
  },
  validate_token:function(token){
    return jwt.verify(token, token_secret, (err, decodedToken) => {
      return err ? false : true;
    });
  }
};
