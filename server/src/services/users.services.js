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

/**
 * createAccount - Create new user account
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
 * login - Login to existing user account
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

async function getUser(payload) {
  const { userId } = payload;

  const foundUser = await populateUserData(User.findById(userId));

  if (!foundUser) {
    return responses.buildFailureResponse("User does not exist", 400);
  }

  return responses.buildSuccessResponse("User details found", 200, foundUser);
}

async function updateUser(user, payload) {
  const currentUser = await User.findById(user._id);
  if (!currentUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  const updatedUser = await populateUserData(
    User.findByIdAndUpdate(
      user._id,
      { $set: payload },
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

async function uploadImage(user, file) {
  const currentUser = await User.findById(user._id);

  if (!currentUser) {
    return {
      message: "User not found",
      statusCode: 404,
      status: "failure",
    };
  }

  const imageUpload = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });

  const imageURL = imageUpload.secure_url;

  currentUser.image = imageURL;

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
      availabilityMap.set(dateKey, entry.slots);
    } else {
      availabilityMap.delete(dateKey);
    }
  }

  // Convert map back to array
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
 * setPreferredLocation - Update preferred location for the authenticated user
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
 * Education Services
 */
async function addEducation(user, data) {
  const education = await Education.create({ ...data, userId: user._id });
  await User.findByIdAndUpdate(user._id, {
    $push: { education: education._id },
  });
  return responses.buildSuccessResponse(
    "Education added successfully",
    201,
    education
  );
}

async function getEducations(user) {
  const educations = await Education.find({ userId: user._id });
  const sortedEducations = sortByEndDate(educations);

  return responses.buildSuccessResponse(
    "Education fetched successfully",
    200,
    sortedEducations
  );
}

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
 * Experience Services
 */
async function addExperience(user, data) {
  const experience = await Experience.create({ ...data, userId: user._id });
  await User.findByIdAndUpdate(user._id, {
    $push: { experience: experience._id },
  });

  return responses.buildSuccessResponse(
    "Experience added successfully",
    201,
    experience
  );
}

async function getExperiences(user) {
  const experiences = await Experience.find({ userId: user._id });
  const sortedExperiences = sortByEndDate(experiences);

  return responses.buildSuccessResponse(
    "Experience fetched successfully",
    200,
    sortedExperiences
  );
}

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
 * Session Services
 */
async function addSession(user, data) {
  const session = await Session.create({ ...data, userId: user._id });
  await User.findByIdAndUpdate(user._id, {
    $push: { sessions: session._id },
  });

  return responses.buildSuccessResponse(
    "Session added successfully",
    201,
    session
  );
}

async function getSessions(user) {
  const sessions = await Session.find({ userId: user._id });

  return responses.buildSuccessResponse(
    "Sessions fetched successfully",
    200,
    sessions
  );
}

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

async function getTutors(params) {
  const { search = "", country, state, city } = params;

  // Base query for tutors
  let query = { role: "tutor" };

  if (country) query["country.name"] = { $regex: new RegExp(country, "i") };
  if (state) {
    query["$or"] = [
      { "state.name": { $regex: new RegExp(state, "i") } },
      { "state.stateCode": { $regex: new RegExp(state, "i") } },
    ];
  }
  if (city) query["city.name"] = { $regex: new RegExp(city, "i") };

  // Find tutors matching location filters
  let tutors = await User.find(query).populate("sessions").lean();

  // If a search term is provided, filter tutors whose sessions match the subject
  if (search.trim()) {
    const lowerSearch = search.trim().toLowerCase();
    tutors = tutors.filter((tutor) =>
      tutor.sessions?.some((session) =>
        session.subject.toLowerCase().includes(lowerSearch)
      )
    );
  }

  return responses.buildSuccessResponse(
    "Tutors fetched successfully",
    200,
    tutors
  );
}

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
