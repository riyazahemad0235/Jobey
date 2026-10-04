import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Job from "../models/jobs.js";

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

const isText = (v) => typeof v === "string" && v.trim().length > 0;

const createUser = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!isText(name) || !isText(email) || !isText(password)) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      message: "Registration successful",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    throw err;
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!isText(email) || !isText(password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  const passwordMatch = user && (await bcrypt.compare(password, user.password));

  // Same message for "no such user" and "wrong password" so accounts can't be guessed
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    ...cookieOptions(),
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
    },
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Logout successful" });
};

const PUBLIC_FIELDS = "-password -savedJobs -archivedJobs";

const currentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select(PUBLIC_FIELDS);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// PUT /api/users/me  { name, phone, location }
const updateProfile = async (req, res) => {
  const { name, phone, location } = req.body ?? {};
  const update = {};

  if (name !== undefined) {
    if (!isText(name)) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    update.name = name.trim();
  }
  if (typeof phone === "string") update.phone = phone.trim();
  if (typeof location === "string") update.location = location.trim();

  const user = await User.findByIdAndUpdate(req.user.userId, update, {
    new: true,
    runValidators: true,
  }).select(PUBLIC_FIELDS);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// ---- Saved + archived jobs (both are per-user lists of Job ids) ----
const listHandlers = (field) => ({
  list: async (req, res) => {
    const user = await User.findById(req.user.userId).populate(field);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user[field].filter(Boolean));
  },

  add: async (req, res) => {
    const { jobId } = req.params;
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    if (!(await Job.exists({ _id: jobId }))) {
      return res.status(404).json({ message: "Job not found" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { [field]: jobId } }, // no duplicates
      { new: true },
    ).populate(field);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user[field].filter(Boolean));
  },

  remove: async (req, res) => {
    const { jobId } = req.params;
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { [field]: jobId } },
      { new: true },
    ).populate(field);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user[field].filter(Boolean));
  },
});

const saved = listHandlers("savedJobs");
const archived = listHandlers("archivedJobs");

export {
  createUser,
  loginUser,
  logoutUser,
  currentUser,
  updateProfile,
  saved,
  archived,
};
