const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
require("dotenv").config();

const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;

  try {
    const newUser = new User({ email, password, subscription });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: `${email}`,
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  user.setToken(token);
  await user.save();

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.setToken(null);
    await user.save();
    res.json({
      status: "success",
      code: 204,
      data: {
        message: "No content",
      },
    });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = await User.findOne(req.token);
    const { email, subscription } = user;
    user.password = undefined;

    res.json({
      status: "success",
      code: 200,
      data: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const { userId, subscription } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );
    user.password = undefined;
    user.token = undefined;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, current, updateSubscription };
