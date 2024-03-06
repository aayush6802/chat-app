// const UserModel = require("../modals/userModel");
// const expressAsyncHandler = require("express-async-handler");
import { encryptPassword } from "../config/encryptPassword.js";
import { generateToken } from "../config/generateToken.js";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { emailValidator } from "../utils/emailValidator.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Login
const loginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    //get user info
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("User not found!");
    } else {
      // compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send("Invalid Password");
      } else {
        if (user.isVerified) {
          res.status(201);
          res.json({
            name: user.name,
            email: user.email,
            pic: user.pic,
            _id: user._id,
            isVerified: user.isVerified,
            token: generateToken(user._id),
          });
        } else {
          res.status(401).json({ message: "Email not verified" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.response.data });
  }
});

// Registration
const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  try {
    if (!name || !email || !password) {
      res.send(400);
      throw Error("All necessary input fields have not been filled");
    }
    // write a email verification using regex
    if (!emailValidator(email)) {
      res.send(400);
      throw Error("Invalid Email");
    }

    // pre-existing user
    const userExist = await User.findOne({ email });
    if (userExist) {
      // res.send(405);
      throw new Error("User already Exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create an entry in the db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
      pic,
    });
    sendEmail(user);
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic.toString(),
        token: generateToken(user._id),
        emailToken: user.emailToken,
      });
    } else {
      res.status(400);
      throw new Error("Registration Error");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  // check for all fields
});

// search user
const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({
      _id: { $ne: req.user._id },
    })
    .select("-password");
  res.json(users);
});

const updateUser = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  try {
    const { name, pic } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.params.id },
      { name, pic },
      { new: true }
    );
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic.toString(),
      });
    } else {
      res.status(400);
      throw new Error("Update Error");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// verify email

const verifyEmail = expressAsyncHandler(async (req, res) => {
  const emailToken = req.body.emailToken;
  console.log(emailToken);
  if (!emailToken) {
    return res.status(400).json({ message: "Email token is missing" });
  }
  try {
    const user = await User.findOne({
      emailToken: emailToken,
    });
    if (!user) {
      return res.status(400).json({ message: "Email token is invalid" });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { email: user.email },
        {
          isVerified: true,
          emailToken: null,
        },
        { new: true }
      );
      console.log("updatedUser->", updatedUser);
      res.status(200).json({
        name: updatedUser?.name,
        email: updatedUser?.email,
        pic: updatedUser?.pic,
        _id: updatedUser?._id,
        isVerified: updatedUser?.isVerified,
        token: generateToken(updatedUser?._id),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });
    if (user) {
      res.status(201).json({
        message: "User Deleted",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  loginController,
  registerController,
  allUsers,
  updateUser,
  deleteUser,
  verifyEmail,
};
