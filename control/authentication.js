import express from "express";
import bcrypt from "bcrypt";
import User from "../model/users.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await userData.save();
    return res.status(200).json({ message: `User ${savedUser.username} has been created!` });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Register before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong mailID or password!" });
    }

    return res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
