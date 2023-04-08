const express = require("express");
const {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyUser,
  resendVerifToken,
} = require("../../models/users");
const {
  auth,
  checkRegData,
  checkLoginData,
  checkLogoutData,
  checkSubscription,
  uploadUserPhoto,
  CheckResendToken,
} = require("../../middlewares/userMIddlewares");

const router = express.Router();

router
  .post("/register", checkRegData, register)
  .post("/login", checkLoginData, login)
  .post("/logout", auth, checkLogoutData, logout)
  .post("/verify", CheckResendToken, resendVerifToken)
  .get("/current", auth, current)
  .get("/verify/:verificationToken", verifyUser)
  .patch("/", auth, checkSubscription, updateSubscription)
  .patch("/avatars", auth, uploadUserPhoto, updateAvatar);

module.exports = router;
