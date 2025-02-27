const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
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
    profileImage: {
      type: String,
      default:
        "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    socketId: String
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
