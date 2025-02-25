const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// //////////////
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res.send("User Already Registerd with this email.");
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const logIn = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res.send("Email or PhoneNumber is required");
    }
    if (!password) {
      return res.send("Password is required");
    }
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist with this email or phone number.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expire in Two Days
      httpOnly: true,
      // secure: true, // make it true if using HTTPS after deploy
      sameSite: "None", // important for cross-site cookies
    };

    res.cookie("chatify_token", token, cookieOptions);
    res.status(200).json({ status: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const me = async (req, res) => {
  try {
    const token = req.cookies.chatify_token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.json({
        message: "Invalid Token",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    res.status(200).json({
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, profile_image } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, profile_image },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
    const isPhoneNumber = /^\d+$/.test(query);

    const searchQuery = {};

    if (isEmail) {
      searchQuery.email = query;
    } else if (isPhoneNumber) {
      searchQuery.phoneNumber = parseInt(query);
    } else {
      return res.status(200).json([]);
    }

    const users = await User.find(searchQuery).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({
      totalUsers: user.length,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signUp, logIn, me, updateProfile, searchUsers, allUsers };
