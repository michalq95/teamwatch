const express = require("express");
const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");

const router = express.Router();
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      playlists: [{ name: "default", playlist: [] }],
    });

    sendTokenResponse(user, 200, res);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { name, password } = req.body;
    if (!name || !password) {
      return next(res.status(400));
    }
    let user = await User.findOne({ name }).select("+password");
    if (!user) {
      return next(res.status(400));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(res.status(400));
    }
    sendTokenResponse(user, 200, res);
  })
);

module.exports = router;

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
