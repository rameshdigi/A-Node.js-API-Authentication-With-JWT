const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validaton");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  //let validate the data before we a user
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //check if the user already in
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //hash passwords

  const salt = await bcrypt.genSalt(10);
  const hashedPassward = await bcrypt.hash(req.body.password, salt);

  //create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassward
  });

  try {
    const saveUser = await user.save();

    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the email already in
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password wrong");

  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //create and assing a token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
