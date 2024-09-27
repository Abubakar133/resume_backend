import userModel from "../models/userModel.mjs";
import insurenceModel from "../models/insurenceModel.mjs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import nodemailer from "nodemailer";

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



export const forget = async (req, res) => {
  const { email,password } = req.body;

  console.log("yes");
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

   
  const oldPassword = user.password
    // Generate a token with email and newPassword
    const secret = process.env.JWT_SECRET; // Store your secret key in .env file
    const token = jwt.sign({ email, password,oldPassword }, secret, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send reset link to the user's email
    const resetLink = `${process.env.Backend}/auth/ResetPassword?token=${token}`;
    
    console.log(resetLink);
    sendMail(resetLink,email);
    // Here, you would send the resetLink via email (use a service like Nodemailer)
    res.status(200).json({ success: true, message: 'Password reset link sent successfully', resetLink });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Password Not reset Please Check your Email again' });
  }
};


// API to reset the password
export const resetPassword = async (req, res) => {
  const { token } = req.query; // Token from the reset link

  try {
    const secret = process.env.JWT_SECRET;

    
    // Verify the token
    const decoded = jwt.verify(token, secret);
    const { email, password, oldPassword } = decoded;

  
    
    
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const sendMail = async (resetLink, email) => {

  //const email = "mehboobabubaker7@gmail.com";
 


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "f201023@cfd.nu.edu.pk",
      pass: "03074659133A",
    },
  });

  const mailOptions = {
    from: "f201023@cfd.nu.edu.pk",
    to: email,
    subject: 'Reset Password',
    text: `Click the link to reset your password: ${resetLink}`, // Plain text body
    
  };

  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send code.");
    } else {
      console.log("Email sent ");
      res.send("your email Send succesfully");
    }
  });

}



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
