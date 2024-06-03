const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/user");

const UserRegister = async (req, res) => {
  //user
  try {
    console.log("imran");
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: "user already exists" });
    }
    const hashedPasword = await bcrypt.hash(password, 10);
    console.log("hash", hashedPasword);
    const newUser = new User({
      name,
      email,

      password: hashedPasword,
    });
    await newUser.save();
    res.status(200).json({ msg: "user registered succesfully" });
  } catch (Error) {
    console.log(Error, "error");
    res.status(500).json({ msg: "internal server error" });
  }
};

const UserLogin = async (req, res) => {
  //user
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    console.log('exist',existUser);
    if (!existUser) {
      return res.status(400).json({ msg: "user not found" });
    }
    const compare = await bcrypt.compare(password, existUser.password);
    if (!compare) {
      return res.status(400).json({ msg: "invalid password" });
    }
    const payload = { userEmail: email, userId: existUser.id };
    const jwtToken = jwt.sign(payload, "qwerty", { expiresIn: "1d" });
    res.status(200).json({ msg: "user logged succesfully", jwtToken });
  } catch (error) {

    console.log("error",error);
    res.status(400).json({ msg: "failed to login" });
  }
};

module.exports = { UserRegister, UserLogin };
