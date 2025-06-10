/**
 * Import Modules
 */
import users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import responses from "../utils/response.js";

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

async function getUser(payload) {
  const { userId } = payload;
  const foundUser = await users.findOne({ _id: userId });

  if (!foundUser) {
    return responses.buildFailureResponse("User does not exist", 400);
  }

  return responses.buildSuccessResponse("User details found", 200, foundUser);
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

/**
 * setAvailability - Set or update availability for a user
 *
 * @param {Object} user - Authenticated user object
 * @param {Array} availability - Array of availability objects to set
 * @returns Success or failure status
 */
async function setAvailability(user, newAvailability) {
  if (!Array.isArray(newAvailability)) {
    return {
      message: "Availability must be an array",
      statusCode: 400,
      status: "failure",
    };
  }

  const userDoc = await users.findById(user._id);
  if (!userDoc) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  const existingAvailability = userDoc.availability || [];

  // Step 1: Map existing availability by date
  const availabilityMap = new Map();
  for (const entry of existingAvailability) {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];
    availabilityMap.set(dateKey, entry.slots);
  }

  // Step 2: Update or remove based on new availability
  for (const entry of newAvailability) {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];

    if (entry.slots && entry.slots.length > 0) {
      // Set or replace slots for the date
      availabilityMap.set(dateKey, entry.slots);
    } else {
      // Remove the date if slots are empty
      availabilityMap.delete(dateKey);
    }
  }

  // Step 3: Convert map back to array
  const mergedAvailability = Array.from(availabilityMap.entries()).map(
    ([date, slots]) => ({
      date: new Date(date),
      slots,
    })
  );

  userDoc.availability = mergedAvailability;
  await userDoc.save();

  return {
    message: "Availability updated successfully",
    statusCode: 200,
    status: "success",
    data: mergedAvailability,
  };
}

/**
 * getAvailability - Get availability for a specific user
 *
 * @param {Object} user - Authenticated user object
 * @returns Success or failure status
 */
async function getAvailability(user) {
  const foundUser = await users.findById(user._id).select("availability");
  if (!foundUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  return {
    message: "Availability fetched successfully",
    statusCode: 200,
    status: "success",
    data: foundUser.availability,
  };
}

/**
 * setPreferredLocation - Update preferred location for the authenticated user
 *
 * @param {object} user - Authenticated user object
 * @param {object} preferredLocations - Object containing preferred location flags
 * @returns {object} - Response with status and message
 */
async function setPreferredLocation(user, preferredLocations) {
  const userDoc = await users.findById(user._id);
  if (!userDoc) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  userDoc.preferredLocations = {
    publicPlace: !!preferredLocations.publicPlace,
    tutorPlace: !!preferredLocations.tutorPlace,
    online: !!preferredLocations.online,
  };

  await userDoc.save();

  return {
    message: "Preferred location updated successfully",
    statusCode: 200,
    status: "success",
    data: userDoc.preferredLocations,
  };
}

/**
 * getPreferredLocation - Retrieve preferred location of the authenticated user
 *
 * @param {object} user - Authenticated user object
 * @returns {object} - Response with status and data
 */
async function getPreferredLocation(user) {
  const userDoc = await users.findById(user._id).select("preferredLocations");
  if (!userDoc) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  return {
    message: "Preferred location fetched successfully",
    statusCode: 200,
    status: "success",
    data: userDoc.preferredLocations,
  };
}

export default {
  createAccount,
  login,
  getUser,
  updateUser,
  setAvailability,
  getAvailability,
  setPreferredLocation,
  getPreferredLocation,
};
