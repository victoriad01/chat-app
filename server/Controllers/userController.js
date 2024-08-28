import userModel from "../Models/userModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid Email!" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Strong Password Required!" });

    if (name.length < 3)
      return res.status(400).json({ message: "Name is too short!" });

    if (name.length > 200)
      return res.status(400).json({ message: "Name is too long!" });

    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist!" });
    }

    user = new userModel(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(201).json({
      message: "User Created Successfully!",
      data: { id: user._id, email, name, token },
    });
  } catch (error) {
    // Come back for proper error handling
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid Email!" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Invalid Password!" });

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid email or password!" });

    const token = createToken(user._id);
    res.status(200).json({
      message: "Login Successfull!",
      data: { id: user._id, email, name: user.name, token },
    });
  } catch (error) {
    // Come back for proper error handling
    console.log(error);
    res.status(500).json(error);
  }
};

export const findUser = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.status(400).json({ message: "Invalid ID!" });

  try {
    const user = await userModel.findById(userId);
    user
      ? res.status(200).json({
          status: "success",
          data: { id: user._id, email: user.email, name: user.name },
        })
      : res.status(404).json({
          status: "fail",
          message: "Not Found!",
        });
  } catch (error) {
    // Come back for proper error handling
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();
    user.length > 0
      ? res.status(200).json({
          status: "success",
          data: user,
        })
      : res.status(404).json({
          status: "success",
          message: "But no User Found!",
        });
  } catch (error) {
    // Come back for proper error handling
    console.log(error);
    res.status(500).json(error);
  }
};
