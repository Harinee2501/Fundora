const User = require('../models/User');
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const profileImageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : "";

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("EMAIL:", email);
  console.log("PASSWORD:", password);

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("USER:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
};
