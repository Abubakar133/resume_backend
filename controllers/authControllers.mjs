import userModel from "../models/userModel.mjs";
import insurenceModel from "../models/insurenceModel.mjs";

import bcrypt from "bcrypt";


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      success: true,
      message: "User logged in successfully2",
      token: await user.generateToken(),
      username : user.username,
      userId: user._id,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const signup = async (req, res) => {
  const {
    username,
    email,
    password,
  
  } = req.body;

  try {
    console.log("Received data:", req.body);

    if (
      !username||
      !email ||
      !password
     
    ) {
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

   

    res.status(201).json({
      success: true,
      message: "User created succesfully",
      token: await user.generateToken(),
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).json({ error: error.message });
  }
};
