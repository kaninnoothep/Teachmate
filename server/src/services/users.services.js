/**
 * Import Modules
 */
import users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * createAccount - Create new user account
 *
 * @param {Object} payload - Data to use for creating a new account
 * @returns Success or failure status
 */
async function createAccount(payload) {
  const { firstName, lastName, email, role } = payload;

  // Ensure all required fields exist
  if (!firstName || !lastName || !payload.password || !email || !role) {
    return {
      message: "Missing required fields",
      statusCode: 400,
      status: "failure",
    };
  }

  // Check if email exists in database
  const foundEmail = await users.findOne({ email: email });
  if (foundEmail) {
    return {
      message: "Account already exists",
      statusCode: 400,
      status: "failure",
    };
  }

  // Save hashed password instead of raw password
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword;

  // Create new user
  const newUser = await users.create(payload);
  return {
    message: "Account created successfully",
    statusCode: 201,
    status: "success",
    data: newUser,
  };
}

/**
 * login - Login to existing user account
 *
 * @param {Object} payload - Data to use for login to an existing account
 * @returns Success or failure status
 */
async function login(payload) {
  const { email, password } = payload;
  // Check if account exists in db using the email
  const foundAccount = await users.findOne({ email: email }).lean();
  if (!foundAccount) {
    return {
      message: "Account does not exist",
      statusCode: 404,
      status: "failure",
    };
  }

  // Compare password entered against actual password
  const passwordMatch = await bcrypt.compare(password, foundAccount.password);
  if (!passwordMatch) {
    return {
      message: "Passwords do not match",
      statusCode: 400,
      status: "failure",
    };
  }
  // Create JWT token
  const token = jwt.sign(
    {
      _id: foundAccount._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );

  foundAccount.accessToken = token;
  return {
    message: "Login Successful",
    statusCode: 200,
    status: "success",
    data: foundAccount,
  };
}

async function updateUser(user, payload) {
  const currentUser = await users.findById(user._id);
  if (!currentUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  const updatedUser = await users.findByIdAndUpdate(
    user._id,
    { $set: payload }, // Update the fields provided in the payload
    { new: true, useFindAndModify: false }
  );

  // Check if the user was found and updated
  if (!updatedUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  return {
    message: "User updated successfully",
    statusCode: 200,
    status: "success",
    data: updatedUser,
  };
}

export default {
  createAccount,
  login,
  updateUser,
};
