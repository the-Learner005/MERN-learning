const User = require("../models/users.model");
const tempUser = require("../models/tempusers.model");
const emailHelper = require("../helpers/mail.helper");
const jwtHelper = require("../helpers/jwt.helper");
const maxAge = 24 * 60 * 60;

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
      // user.create is async request that returns a promise,
      // const user = await User.create({email, password});
      const user = await tempUser.create({ email: email, password: password });
      const token = jwtHelper.createToken(user._id);
      await tempUser.update_user({ _id: user._id }, { token: token });
      var fullUrl = req.protocol + "://" + req.get("host");

      var mailOptions = {
        from: "pizzahouse@yahoo.com",
        to: email,
        subject: "Please Verify Your Account",
        text: "Click On this link \n " + fullUrl + "?token=" + token,
      };

      emailHelper.sendMail(mailOptions);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ userid: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  login_get: (req, res) => {
    res.render("login");
  },

  login_post: async (req, res) => {
    res.locals.success_message = "";
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ userid: user._id });
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
      const temp_user = await tempUser.findUserByToken(req.query.token);
      const new_user = { email: temp_user.email, password: temp_user.password };
      await User.create(new_user);
      await tempUser.remove_user(temp_user._id);
      res.locals.success_message = "You Have Verified Account";
      res.cookie("jwt", "", { maxAge: 1 });
      res.redirect("/login");
    } else {
      res.send("YOU ARE NOT VALIDATED");
      console.log("You are not validated");
    }
  },
};