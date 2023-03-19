const express = require("express");
const User = require("../models/user.model.js");

const router = express.Router();
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 200, res);
  })
);

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: {
        name: user.name,
        playlists: user.playlists,
      },
      token,
    });
};
