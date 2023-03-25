const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 20,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      minlength: 7,
      maxlength: 40,
    },
    phone: {
      type: String,
      minlength: 5,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: false }
);

const Contact = mongoose.model("Contact", contact);

module.exports = Contact;
