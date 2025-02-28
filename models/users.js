const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const ImageService = require("../service/imageService");
const sendConfirmEmail = require("../service/emailService");
require("dotenv").config();

const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;

  try {
    const newUser = new User({ email, password, subscription });
    newUser.setPassword(password);
    await newUser.save();
    sendConfirmEmail(email, newUser.verificationToken);
    res.status(201).json({
      user: {
        email: `${email}`,
        subscription: "starter",
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

  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  user.setToken(token);
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: `${email}`,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.setToken(null);
    await user.save();
    return res.status(204).json({ message: "No content" });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = await User.findOne(req.token);
    const { email, subscription } = user;
    user.password = undefined;

    res.status(200).json({
      email: email,
      subscription: subscription,
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

const updateAvatar = async (req, res) => {
  const { user, file } = req;

  if (file) {
    user.avatarURL = await ImageService.save(file, 250, 250, "avatars");
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  const updateUser = await user.save();

  res.status(200).json({ avatarURL: updateUser.avatarURL });
};

const verifyUser = async (req, res) => {
  try {
    const token = req.params.verificationToken;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.setVerify(true);
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error(error);
  }
};

const resendVerifToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    sendConfirmEmail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyUser,
  resendVerifToken,
};
