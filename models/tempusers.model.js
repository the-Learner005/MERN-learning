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
  token: {
    type:String
  },
  created_at :{
    type: Date,
    default: Date.now
  }

});


// Life Cycle Hooks

userScheme.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); 
  this.created_at = new Date();
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

userScheme.statics.update_user = async function(filter, update){
  return await this.findOneAndUpdate(filter, update, false);
}

userScheme.statics.findUserByToken = async function(token){
  return await this.findOne({token});
}

userScheme.statics.remove_user = async function(id){
  await this.findByIdAndDelete(id);
}

const tempUser = mongoose.model('temp_user', userScheme);


module.exports = tempUser;
