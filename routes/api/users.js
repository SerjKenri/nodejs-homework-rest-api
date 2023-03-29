const express = require("express");
const {
  register,
  login,
  logout,
  current,
  updateSubscription,
} = require("../../models/users");
const {
  auth,
  checkRegData,
  checkLoginData,
  checkLogoutData,
  checkSubscription,
} = require("../../middlewares/userMIddlewares");

const router = express.Router();

router
  .post("/register", checkRegData, register)
  .post("/login", checkLoginData, login)
  .post("/logout", auth, checkLogoutData, logout)
  .get("/current", auth, current)
  .patch("/", auth, checkSubscription, updateSubscription);

module.exports = router;
