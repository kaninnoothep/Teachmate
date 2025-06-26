/**
 * Import Modules
 */
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import responses from "../utils/response.js";
import Education from "../models/education.model.js";
import Experience from "../models/experience.model.js";
import Session from "../models/session.model.js";
import { sortByEndDate } from "../utils/sortByEndDate.js";
import { populateUserData } from "../utils/populateUserData.js";
import { v2 as cloudinary } from "cloudinary";
import { checkProfileCompletion } from "../utils/checkProfileCompletion.js";

/**
 * createAccount - Create new user account
 *
 * @param {Object} payload - User details for registration
 * @returns {Object} Success or failure status with message and data
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
  const foundEmail = await User.findOne({ email: email });
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
  const newUser = await User.create(payload);
  return {
    message: "Account created successfully",
    statusCode: 201,
    status: "success",
    data: newUser,
  };
}

/**
 * login - Log in an existing user
 *
 * @param {Object} payload - Email and password
 * @returns {Object} Success or failure status with authenticated user info and token
 */
async function login(payload) {
  const { email, password } = payload;

  // Find account and populate with sorted data
  const foundAccount = await populateUserData(
    User.findOne({ email: email }).lean()
  );

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
  const token = jwt.sign({ _id: foundAccount._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  foundAccount.accessToken = token;
  return {
    message: "Login Successful",
    statusCode: 200,
    status: "success",
    data: foundAccount,
  };
}

/**
 * getUser - Retrieve a user by ID
 *
 * @param {Object} payload - Contains userId
 * @returns {Object} Success or failure status with user data
 */
async function getUser(payload) {
  const { userId } = payload;

  const foundUser = await populateUserData(User.findById(userId));

  if (!foundUser) {
    return responses.buildFailureResponse("User does not exist", 400);
  }

  return responses.buildSuccessResponse("User details found", 200, foundUser);
}

/**
 * updateUser - Update user profile
 *
 * @param {Object} user - Current user object
 * @param {Object} payload - Fields to update
 * @returns {Object} Updated user or error
 */
async function updateUser(user, payload) {
  const currentUser = await User.findById(user._id);
  if (!currentUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  // Merge updates and check if profile completion
  const updatedUser = await populateUserData(
    User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          ...payload,
          isProfileCompleted: checkProfileCompletion({
            ...currentUser.toObject(),
            ...payload,
          }),
        },
      },
      { new: true, useFindAndModify: false }
    )
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
 * uploadImage - Upload a profile image to Cloudinary
 *
 * @param {Object} user - Current user
 * @param {Object} file - Image file to upload
 * @returns {Object} Image URL or error
 */
async function uploadImage(user, file) {
  const currentUser = await User.findById(user._id);

  if (!currentUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  // Upload image to cloudinary
  const imageUpload = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });

  const imageURL = imageUpload.secure_url;

  currentUser.image = imageURL;
  currentUser.isProfileCompleted = checkProfileCompletion(currentUser);

  await currentUser.save();

  return {
    message: "Image uploaded successfully",
    statusCode: 200,
    status: "success",
    data: currentUser.image,
  };
}

/**
 * setAvailability - Set or update availability for a user
 *
 * @param {Object} user - Authenticated user
 * @param {Array} newAvailability - Array of availability objects
 * @returns {Object} Updated availability or error
 */
async function setAvailability(user, newAvailability) {
  if (!Array.isArray(newAvailability)) {
    return {
      message: "Availability must be an array",
      statusCode: 400,
      status: "failure",
    };
  }

  const userDoc = await User.findById(user._id);
  if (!userDoc) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  const existingAvailability = userDoc.availability || [];

  // Map existing availability by date
  const availabilityMap = new Map();
  for (const entry of existingAvailability) {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];
    availabilityMap.set(dateKey, entry.slots);
  }

  // Update or remove based on new availability
  for (const entry of newAvailability) {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];

    if (entry.slots && entry.slots.length > 0) {
      // Sort slots by startTime before setting
      const sortedSlots = [...entry.slots].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      availabilityMap.set(dateKey, sortedSlots);
    } else {
      availabilityMap.delete(dateKey);
    }
  }

  // Convert map back to array and sort by date
  const mergedAvailability = Array.from(availabilityMap.entries())
    .map(([date, slots]) => ({
      date: new Date(date),
      slots,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
 * getAvailability - Retrieve availability for a user
 *
 * @param {Object} user - Authenticated user
 * @returns {Object} Availability array or error
 */
async function getAvailability(user) {
  const foundUser = await User.findById(user._id).select("availability");
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
 * setPreferredLocation - Set tutor's preferred location
 *
 * @param {Object} user - Authenticated user
 * @param {Object} preferredLocations - Preferred location settings
 * @returns {Object} Updated preferences or error
 */
async function setPreferredLocation(user, preferredLocations) {
  const userDoc = await User.findById(user._id);
  if (!userDoc) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  // Set the new preferred location
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
 * getPreferredLocation - Get user's preferred location
 *
 * @param {Object} user - Authenticated user
 * @returns {Object} Preferred location or error
 */
async function getPreferredLocation(user) {
  const userDoc = await User.findById(user._id).select("preferredLocations");
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

/**
 * Education
 */

/**
 * addEducation - Add an education record to user
 *
 * @param {Object} user - Authenticated user
 * @param {Object} data - Education details
 * @returns {Object} Added education or error
 */
async function addEducation(user, data) {
  const education = await Education.create({ ...data, userId: user._id });

  // Add the education ID to user's education array
  await User.findByIdAndUpdate(user._id, {
    $push: { education: education._id },
  });

  return responses.buildSuccessResponse(
    "Education added successfully",
    201,
    education
  );
}

/**
 * getEducations - Retrieve user's education records
 *
 * @param {Object} user - Authenticated user
 * @returns {Object} Sorted list of education records
 */
async function getEducations(user) {
  const educations = await Education.find({ userId: user._id });
  const sortedEducations = sortByEndDate(educations);

  return responses.buildSuccessResponse(
    "Education fetched successfully",
    200,
    sortedEducations
  );
}

/**
 * updateEducation - Update a specific education record
 *
 * @param {Object} user - Authenticated user
 * @param {string} educationId - ID of the education to update
 * @param {Object} data - Updated education fields
 * @returns {Object} Updated education or error
 */
async function updateEducation(user, educationId, data) {
  const updated = await Education.findOneAndUpdate(
    { _id: educationId, userId: user._id },
    { $set: data },
    { new: true }
  );
  if (!updated)
    return responses.buildFailureResponse("Education not found", 404);

  return responses.buildSuccessResponse(
    "Education updated successfully",
    200,
    updated
  );
}

/**
 * deleteEducation - Delete a specific education record
 *
 * @param {Object} user - Authenticated user
 * @param {string} educationId - ID of the education to delete
 * @returns {Object} Deleted education or error
 */
async function deleteEducation(user, educationId) {
  const deleted = await Education.findOneAndDelete({
    _id: educationId,
    userId: user._id,
  });

  if (!deleted)
    return responses.buildFailureResponse("Education not found", 404);

  // Remove the education ID from user's education array
  await User.findByIdAndUpdate(user._id, {
    $pull: { education: educationId },
  });

  return responses.buildSuccessResponse(
    "Education deleted successfully",
    200,
    deleted
  );
}

/**
 * Experience
 */

/**
 * addExperience - Add a work experience record to user
 *
 * @param {Object} user - Authenticated user
 * @param {Object} data - Experience details
 * @returns {Object} Added experience or error
 */
async function addExperience(user, data) {
  const experience = await Experience.create({ ...data, userId: user._id });

  // Add the experience ID to user's experience array
  await User.findByIdAndUpdate(user._id, {
    $push: { experience: experience._id },
  });

  return responses.buildSuccessResponse(
    "Experience added successfully",
    201,
    experience
  );
}

/**
 * getExperiences - Retrieve user's experience records
 *
 * @param {Object} user - Authenticated user
 * @returns {Object} Sorted list of experience records
 */

async function getExperiences(user) {
  const experiences = await Experience.find({ userId: user._id });
  const sortedExperiences = sortByEndDate(experiences);

  return responses.buildSuccessResponse(
    "Experience fetched successfully",
    200,
    sortedExperiences
  );
}

/**
 * updateExperience - Update a specific experience record
 *
 * @param {Object} user - Authenticated user
 * @param {string} experienceId - ID of the experience to update
 * @param {Object} data - Updated experience fields
 * @returns {Object} Updated experience or error
 */
async function updateExperience(user, experienceId, data) {
  const updated = await Experience.findOneAndUpdate(
    { _id: experienceId, userId: user._id },
    { $set: data },
    { new: true }
  );
  if (!updated)
    return responses.buildFailureResponse("Experience not found", 404);

  return responses.buildSuccessResponse(
    "Experience updated successfully",
    200,
    updated
  );
}

/**
 * deleteExperience - Delete a specific experience record
 *
 * @param {Object} user - Authenticated user
 * @param {string} experienceId - ID of the experience to delete
 * @returns {Object} Deleted experience or error
 */
async function deleteExperience(user, experienceId) {
  const deleted = await Experience.findOneAndDelete({
    _id: experienceId,
    userId: user._id,
  });
  if (!deleted)
    return responses.buildFailureResponse("Experience not found", 404);

  // Remove the experience ID from user's experience array
  await User.findByIdAndUpdate(user._id, {
    $pull: { experience: experienceId },
  });

  return responses.buildSuccessResponse(
    "Experience deleted successfully",
    200,
    deleted
  );
}

/**
 * Session
 */

/**
 * addSession - Add a session entry for the tutor
 *
 * @param {Object} user - Authenticated tutor
 * @param {Object} data - Session details
 * @returns {Object} Added session or error
 */
async function addSession(user, data) {
  const session = await Session.create({ ...data, userId: user._id });

  // Add the session ID to user's session array
  await User.findByIdAndUpdate(user._id, {
    $push: { sessions: session._id },
  });

  return responses.buildSuccessResponse(
    "Session added successfully",
    201,
    session
  );
}

/**
 * getSessions - Retrieve sessions of the tutor
 *
 * @param {Object} user - Authenticated tutor
 * @returns {Object} List of sessions
 */
async function getSessions(user) {
  const sessions = await Session.find({ userId: user._id });

  return responses.buildSuccessResponse(
    "Sessions fetched successfully",
    200,
    sessions
  );
}

/**
 * updateSession - Update a specific session
 *
 * @param {Object} user - Authenticated tutor
 * @param {string} sessionId - ID of the session to update
 * @param {Object} data - Updated session fields
 * @returns {Object} Updated session or error
 */

async function updateSession(user, sessionId, data) {
  const updated = await Session.findOneAndUpdate(
    { _id: sessionId, userId: user._id },
    { $set: data },
    { new: true }
  );
  if (!updated) return responses.buildFailureResponse("Session not found", 404);

  return responses.buildSuccessResponse(
    "Session updated successfully",
    200,
    updated
  );
}

/**
 * deleteSession - Delete a specific session
 *
 * @param {Object} user - Authenticated tutor
 * @param {string} sessionId - ID of the session to delete
 * @returns {Object} Deleted session or error
 */
async function deleteSession(user, sessionId) {
  const deleted = await Session.findOneAndDelete({
    _id: sessionId,
    userId: user._id,
  });
  if (!deleted) return responses.buildFailureResponse("Session not found", 404);

  // Remove the session ID from user's sessions array
  await User.findByIdAndUpdate(user._id, {
    $pull: { sessions: sessionId },
  });

  return responses.buildSuccessResponse(
    "Session deleted successfully",
    200,
    deleted
  );
}

/**
 * getTutors - Search and filter tutors based on query
 *
 * @param {Object} params - Search and location filter parameters
 * @returns {Object} List of matching tutors
 */
async function getTutors(params) {
  const { search = "", country, state, city } = params;

  // Base query to find users with role "tutor" and optional country match
  const locationMatch = {
    role: "tutor",
    ...(country && { "country.name": { $regex: new RegExp(country, "i") } }),
  };

  // Add state filter if provided (matches state name or code)
  if (state) {
    locationMatch["$or"] = [
      { "state.name": { $regex: new RegExp(state, "i") } },
      { "state.stateCode": { $regex: new RegExp(state, "i") } },
    ];
  }

  // Add city filter if provided
  if (city) {
    locationMatch["city.name"] = { $regex: new RegExp(city, "i") };
  }

  // MongoDB aggregation pipeline starts with location-based filtering
  const pipeline = [
    { $match: locationMatch },
    {
      $lookup: {
        from: "sessions",
        localField: "_id",
        foreignField: "userId",
        as: "sessions",
      },
    },
  ];

  // If a search term is provided, filter tutors by session subject
  if (search.trim()) {
    pipeline.push({
      $match: {
        "sessions.subject": {
          $regex: new RegExp(search.trim(), "i"),
        },
      },
    });
  }

  // Run the aggregation query to get matching tutors
  const tutors = await User.aggregate(pipeline);

  // Return successful response with the list of tutors
  return responses.buildSuccessResponse(
    "Tutors fetched successfully",
    200,
    tutors
  );
}

/**
 * Export all functions
 */
export default {
  createAccount,
  login,
  getUser,
  updateUser,
  uploadImage,
  setAvailability,
  getAvailability,
  setPreferredLocation,
  getPreferredLocation,
  addEducation,
  getEducations,
  updateEducation,
  deleteEducation,
  addExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
  addSession,
  getSessions,
  updateSession,
  deleteSession,
  getTutors,
};
