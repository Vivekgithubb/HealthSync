// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";
// Generate JWT Token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, //for https
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, {
    cookieOptions,
  });

  //removes password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (!user) return res.status(400).json({ message: "Invalid user data" });
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!process.env.RECAPTCHA_SECRET) {
      return res.status(500).json({ message: "reCAPTCHA not configured" });
    }

    // Validate input
    if (!email || !password || !recaptchaToken) {
      return res
        .status(400)
        .json({ message: "Something is missing, check again" });
    }

    // Verify reCAPTCHA with Google
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET);
    params.append("response", recaptchaToken);
    if (req.ip) params.append("remoteip", req.ip);

    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const googleRes = await axios.post(verifyUrl, params);
    const isHuman = googleRes?.data?.success === true;
    if (!isHuman) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (user && (await user.comparePassword(password))) {
      createSendToken(user, 200, res);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.address = req.body.address || user.address;
      user.emergencyContact =
        req.body.emergencyContact || user.emergencyContact;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
