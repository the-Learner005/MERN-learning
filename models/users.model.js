const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please Enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please Enter password'],
    minlength: [6, 'Minimum Password length is 6 characters'],
  },  
});


// Life Cycle Hooks

userScheme.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});

userScheme.post('save', function(doc, next){
  next();
});

userScheme.statics.login = async function(email, password){
  const user = await this.findOne({email});
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error('Password is Incorrect');
  }
  throw Error('Incorrect Email');
}

userScheme.findUserById = async function(id){
  return await this.findOne({id});
}

const User = mongoose.model('user', userScheme);


module.exports = User;
