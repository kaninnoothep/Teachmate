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
    // Validate JWT
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }
    const token = authorization.substring(7);

    const decodedUser = await jwt.decode(token);

    const foundUser = await user.findOne({ _id: decodedUser._id });

    if (foundUser.role !== "tutor") {
      return res.status(400).json({
        message: "Only Tutors Allowed",
        status: "failure",
      });
    }

    req.user = foundUser;
    next();
  } catch (error) {
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
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }
    const token = authorization.substring(7);

    const decodedUser = await jwt.decode(token);

    const foundUser = await user.findOne({ _id: decodedUser._id });

    if (foundUser.role !== "student") {
      return res.status(400).json({
        message: "Only Students Allowed",
        status: "failure",
      });
    }

    req.user = foundUser;
    next();
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .send(error?.message || "Unable to authenticate");
  }
};

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    // Validate JWT
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Authorization header must start with 'Bearer '",
        status: "failure",
      });
    }
    const token = authorization.substring(7);

    const decodedUser = await jwt.decode(token);

    const foundUser = await user.findOne({ _id: decodedUser._id });

    req.user = foundUser;
    next();
  } catch (error) {
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
