import { User } from "../models/user.model.js";
import { hash, compare } from "bcrypt";
import { COOKIE_OPTIONS } from "../constants.js";

export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (
    [firstname, lastname, email, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  try {
    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const loginUser = async(req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid login credentials" });

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    res.status(200).cookie("accessToken", accessToken, COOKIE_OPTIONS).json({
      message: "User logged in successfully!",
      user: loggedInUser,
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const logoutUser = async (_, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .json({ message: "User logged out" });
}

export const getUser = async (req, res) => {
  const loggedInUser = req?.user;

  if (!loggedInUser)
    return res.status(404).json({ message: "User not found" })

  return res
    .status(200)
    .json({ message: "User found!", user: loggedInUser})
}