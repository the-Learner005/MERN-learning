const emailHelper = require("../helpers/mail.helper");
const jwtHelper = require("../helpers/jwt.helper");
const dotenv = require('dotenv');
dotenv.config();

const maxAge = process.env.TOKEN_EXPIRY_TIME;
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect Email") {
    errors.email = "Incorrect Email";
    return errors;
  } else if (err.message === "Password is Incorrect") {
    errors.password = "Incorrect Password";
    return errors;
  }

  if (err.code == 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  Object.values(err.errors).forEach(({ properties }) => {
    errors[properties.path] = properties.message;
  });

  return errors;
};

module.exports = {
  signup_get: (req, res) => {
    res.render("signup");
  },

  signup_post: async (req, res) => {
    const { email, password } = req.body;
    try {
  
      const token = jwtHelper.createToken(11122);
      var fullUrl = req.protocol + "://" + req.get("host");
      var mailOptions = {
        from: "pizzahouse@yahoo.com",
        to: email,
        subject: "Please Verify Your Account",
        text: "Click On this link \n " + fullUrl + "?token=" + token,
      };
      emailHelper.sendMail(mailOptions);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ userid: 11122 });

    } catch (err) {
      console.log(err);
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  login_get: (req, res) => {
    res.render("login");
  },

  login_post: async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = jwtHelper.createToken(11122);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ userid: 11122 });
      
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  logout_get: (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/login");
  },

  verify_get: async (req, res) => {
    if (jwtHelper.validate_token(req.query.token)) {
      res.locals.success_message = "You Have Verified Account";
      res.cookie("jwt", "", { maxAge: 1 });
      res.redirect("/login");
    } else {
      res.send("YOU ARE NOT VALIDATED");
      console.log("You are not validated");
    }
  },
};