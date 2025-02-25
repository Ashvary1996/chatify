const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    lastName: { type: String, required: [true, "Please Enter Your Last Name"] },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regex for email validation
        "Please enter a valid email address",
      ],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please Enter Your Phone Number"],
      min: [
        6000000000,
        "Enter Valid Phone Number, it must be 10 digits and start with 6...",
      ],
      max: [9999999999, "Phone number cannot exceed 10 digits"],
    },
    password: { type: String, required: [true, "Please Enter Your Password"] },
    isOnline: { type: Boolean, default: false },
    profile_image: { type: String },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
