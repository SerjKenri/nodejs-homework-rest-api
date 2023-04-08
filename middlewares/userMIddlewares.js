const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../service/schemas/user");
const ImageService = require("../service/imageService");
const {
  userValidator,
  subsValidator,
  verifyValidator,
} = require("../utils/validator");
require("dotenv").config();
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, function (payload, done) {
    User.find({ _id: payload.id })
      .then(([user]) => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      })
      .catch((error) => done(error));
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({ message: "Not authorized" });
    } else if (!user.verify) {
      return res
        .status(401)
        .json({ message: "The user has not confirmed themselves via email." });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const checkRegData = async (req, res, next) => {
  const { email } = req.body;
  const { error, value } = userValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const user = await User.findOne({ email });
  if (user) return res.status(409).json({ message: "Email in use" });
  req.body = value;
  next();
};

const checkLoginData = async (req, res, next) => {
  const { error, value } = userValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user.verify) {
    return res
      .status(401)
      .json({ message: "The user has not confirmed themselves via email." });
  }

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  req.body = value;
  next();
};

const checkLogoutData = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).json({ message: "Not authoruzed" });
  next();
};

const checkSubscription = async (req, res, next) => {
  const { subscription, userId } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { error } = subsValidator({ subscription });

  if (error)
    return res.status(400).json({
      message: error.details[0].message,
    });

  next();
};

const CheckResendToken = async (req, res, next) => {
  const { email } = req.body;
  const { error } = verifyValidator({ email });
  const user = await User.findOne({ email });

  if (error)
    return res.status(400).json({
      message: error.details[0].message,
    });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify)
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });

  next();
};

const uploadUserPhoto = ImageService.upload("avatar");

module.exports = {
  auth,
  checkRegData,
  checkLoginData,
  checkLogoutData,
  checkSubscription,
  uploadUserPhoto,
  CheckResendToken,
};
