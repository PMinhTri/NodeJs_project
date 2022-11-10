const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //Simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    //Check for existing user
    const user = await User.findOne({ username: username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username!" });

    //If username found
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    const originPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = password;
    if (inputPassword !== originPassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
