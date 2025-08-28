import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  // Retrieve the token from the cookie
  const token = req.cookies?.accessToken;

  // If no token, return an error
  if (!token) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    // Verify the token with the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists
    const user = await User.findById(decodedToken?._id).select("-password");

    // If user does not exist, return error
    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // Attach the user object to the request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access token is not valid" });
  }
};
