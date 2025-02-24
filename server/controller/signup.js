const User = require("../models/User");

const signUpFn = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const existing_user = await User.findOne({ email: req.body.email });
    if (existing_user) {
      return res.send("User Already Registerd with this email.");
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    // console.log("newUser", newUser);
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log("error.msg", error.message);
    res.send({ error: error.message });
  }
};

module.exports = signUpFn;
