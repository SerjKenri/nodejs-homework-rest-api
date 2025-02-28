const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");
const crypto = require("crypto");
const uuid = require("uuid").v4;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");

    this.verificationToken = `${uuid()}`;

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`;
  }

  next();
});

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.setToken = function (token) {
  return (this.token = token);
};

userSchema.methods.setVerify = function (verify) {
  this.verify = verify;
  this.verificationToken = null;
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
