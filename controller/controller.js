const asynchandler = require("express-async-handler");
const { OneUser } = require("../model/model");
const CustomErrorApi = require("../err/err");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const generateAuthToken = require("../jwt/jwt");
const { parsePhoneNumber } = require("awesome-phonenumber");

const signupuser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone)
      return res
        .status(400)
        .json({ msg: "PLease fill all the required fields" });
    const exists = await OneUser.findOne({ email });

    if (exists) return res.status(400).json({ msg: "Enter a unique email" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const pn = parsePhoneNumber(phone, { regionCode: "PK" });
    const session = await mongoose.startSession();
    session.startTransaction();

    const fuser = await OneUser.create({
      username,
      email,
      password: hashPassword,
      phone: pn.number.e164,
    });

    if (!fuser) {
      throw new CustomErrorApi("Can't Register right now", 400);
    }

    const { access_token, jti } = generateAuthToken(fuser);

    const token = await OneUser.findByIdAndUpdate(
      { _id: fuser._id },
      { token_detail: { access_token, jti } }
    );
    await session.commitTransaction();

    return res.status(201).json({
      msg: "User Created",
      username: fuser.username,
      token: { access_token },
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ msg: "User Not Created" });
  }
};
// =-----------------------------------------------------------------------------------------------
const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Enter your email and password" });

  const user = await OneUser.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { access_token, jti } = generateAuthToken(user);

    const token = await OneUser.findByIdAndUpdate(
      { _id: user._id },
      { token_detail: { access_token, jti } }
    );
    if (!token) {
      return res.status(400).json({ msg: "Please Try again" });
    }
    return res.status(200).json({
      access_token,
      username: user.username,
    });
  }
  return res.status(400).json({ msg: "Invalid email or password" });
});

// ----------------------------------------------
const logout = asynchandler(async (req, res) => {
  const { email } = req.user;
  const user = await OneUser.findOneAndUpdate(
    { email },
    { token_detail: { access_token: null, jti: null } },
    { new: true }
  );

  if (!user) {
    throw new CustomErrorApi("Invalid", 403);
  }
  return res.status(201).json({ msg: "Logout successful" });
});

module.exports = {
  signupuser,
  logout,
  login,
};
