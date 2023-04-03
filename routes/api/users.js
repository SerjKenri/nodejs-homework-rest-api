const express = require("express");
const {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
} = require("../../models/users");
const {
  auth,
  checkRegData,
  checkLoginData,
  checkLogoutData,
  checkSubscription,
  uploadUserPhoto,
} = require("../../middlewares/userMIddlewares");

const router = express.Router();

router
  .post("/register", checkRegData, register)
  .post("/login", checkLoginData, login)
  .post("/logout", auth, checkLogoutData, logout)
  .get("/current", auth, current)
  .patch("/", auth, checkSubscription, updateSubscription)
  .patch("/avatars", auth, uploadUserPhoto, updateAvatar);

module.exports = router;
