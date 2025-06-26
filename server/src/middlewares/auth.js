/**
 * Import modules
 */
import jwt from "jsonwebtoken";
import user from "../models/users.model.js";

/**
 * authenticate - Validate the user based on the jwt
 *                and only allow tutors to proceed with the action
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function to be executed
 * @returns Response object
 */
const tutorAuthenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Validate JWT - Check if Authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }

    // Extract token from Authorization header
    const token = authorization.substring(7);

    // Decode the token to get user data
    const decodedUser = await jwt.decode(token);

    // Find user from database using decoded user ID
    const foundUser = await user.findOne({ _id: decodedUser._id });

    if (foundUser.role !== "tutor") {
      return res.status(400).json({
        message: "Only Tutors Allowed",
        status: "failure",
      });
    }

    // Attach user data to the request object
    req.user = foundUser;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Return error response if authentication fails
    return res
      .status(error?.statusCode || 500)
      .send(error?.message || "Unable to authenticate");
  }
};

/**
 * studentAuthenticate - Validate the user based on the jwt
 *                       and only allow students to proceed with the action
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function to be executed
 * @returns Response object
 */
const studentAuthenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Validate JWT - Check if Authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }

    // Extract token from Authorization header
    const token = authorization.substring(7);

    // Decode the token to get user data
    const decodedUser = await jwt.decode(token);

    // Find user from database using decoded user ID
    const foundUser = await user.findOne({ _id: decodedUser._id });

    if (foundUser.role !== "student") {
      return res.status(400).json({
        message: "Only Students Allowed",
        status: "failure",
      });
    }

    // Attach user data to the request object
    req.user = foundUser;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Return error response if authentication fails
    return res
      .status(error?.statusCode || 500)
      .send(error?.message || "Unable to authenticate");
  }
};

/**
 * authenticate - Middleware to authenticate user via JWT
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Callback to pass control to next middleware
 * @returns {void}
 */

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Validate JWT - Check if Authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }

    // Extract token from Authorization header
    const token = authorization.substring(7);

    // Decode the token to get user data
    const decodedUser = await jwt.decode(token);

    // Find user from database using decoded user ID
    const foundUser = await user.findOne({ _id: decodedUser._id });

    // Attach user data to the request object
    req.user = foundUser;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Return error response if authentication fails
    return res
      .status(error?.statusCode || 500)
      .send(error?.message || "Unable to authenticate");
  }
};

/**
 * Export all functions
 */
export default {
  authenticate,
  studentAuthenticate,
  tutorAuthenticate,
};
