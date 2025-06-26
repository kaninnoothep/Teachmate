/**
 * Import modules
 */
import usersServices from "../services/users.services.js";

/**
 * createAccount - Create a new user account
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function createAccount(req, res) {
  try {
    const response = await usersServices.createAccount(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create account",
      status: "failure",
    });
  }
}

/**
 * login - Login to existing account
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function login(req, res) {
  try {
    const response = await usersServices.login(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to login",
      status: "failure",
    });
  }
}

/**
 * getUser - Retrieve a user details
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getUser(req, res) {
  try {
    const response = await usersServices.getUser(req.params);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to get user",
      status: "failure",
    });
  }
}

/**
 * updateUser - Update user profile
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function updateUser(req, res) {
  try {
    const response = await usersServices.updateUser(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update user",
      status: "failure",
    });
  }
}

/**
 * uploadImage - Upload a profile image
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function uploadImage(req, res) {
  try {
    const response = await usersServices.uploadImage(req.user, req.file);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to upload image",
      status: "failure",
    });
  }
}

/**
 * setAvailability - Set or update availability for a user
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function setAvailability(req, res) {
  try {
    const response = await usersServices.setAvailability(
      req.user,
      req.body.availability
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to set availability",
      status: "failure",
    });
  }
}

/**
 * getAvailability - Retrieve availability for a user
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getAvailability(req, res) {
  try {
    const response = await usersServices.getAvailability(req.user);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to get availability",
      status: "failure",
    });
  }
}

/**
 * setPreferredLocation - Set preferred locations
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function setPreferredLocation(req, res) {
  try {
    const response = await usersServices.setPreferredLocation(
      req.user,
      req.body
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to set preferred location",
      status: "failure",
    });
  }
}

/**
 * getPreferredLocation - Get user's preferred location
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getPreferredLocation(req, res) {
  try {
    const response = await usersServices.getPreferredLocation(req.user);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch preferred location",
      status: "failure",
    });
  }
}

/**
 * Education
 */

/**
 * addEducation - Add an education record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function addEducation(req, res) {
  try {
    const response = await usersServices.addEducation(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to add education", status: "failure" });
  }
}

/**
 * getEducations - Retrieve user's education records
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getEducations(req, res) {
  try {
    const response = await usersServices.getEducations(req.user);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to fetch education", status: "failure" });
  }
}

/**
 * updateEducation - Update a specific education record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function updateEducation(req, res) {
  try {
    const response = await usersServices.updateEducation(
      req.user,
      req.params.id,
      req.body
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to update education", status: "failure" });
  }
}

/**
 * deleteEducation - Delete a specific education record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function deleteEducation(req, res) {
  try {
    const response = await usersServices.deleteEducation(
      req.user,
      req.params.id
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to delete education", status: "failure" });
  }
}

/**
 * Experience
 */

/**
 * addExperience - Add an experience record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function addExperience(req, res) {
  try {
    const response = await usersServices.addExperience(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to add experience", status: "failure" });
  }
}

/**
 * getExperiences - Retrieve user's experience records
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getExperiences(req, res) {
  try {
    const response = await usersServices.getExperiences(req.user);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to fetch experience", status: "failure" });
  }
}

/**
 * updateExperience - Update a specific experience record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function updateExperience(req, res) {
  try {
    const response = await usersServices.updateExperience(
      req.user,
      req.params.id,
      req.body
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to update experience", status: "failure" });
  }
}

/**
 * deleteExperience - Delete a specific exprience record
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function deleteExperience(req, res) {
  try {
    const response = await usersServices.deleteExperience(
      req.user,
      req.params.id
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to delete experience", status: "failure" });
  }
}

/**
 * Sessions
 */

/**
 * addSession - Add a session entry for the tutor
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function addSession(req, res) {
  try {
    const response = await usersServices.addSession(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to add sesssion", status: "failure" });
  }
}

/**
 * getSessions - Retrieve sessions of the tutor
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getSessions(req, res) {
  try {
    const response = await usersServices.getSessions(req.user);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to fetch sesssion", status: "failure" });
  }
}

/**
 * updateSession - Update a specific session
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function updateSession(req, res) {
  try {
    const response = await usersServices.updateSession(
      req.user,
      req.params.id,
      req.body
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to update sesssion", status: "failure" });
  }
}

/**
 * deleteSession - Delete a specific session
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function deleteSession(req, res) {
  try {
    const response = await usersServices.deleteSession(req.user, req.params.id);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to delete sesssion", status: "failure" });
  }
}

/**
 * getTutors - Retrieve tutors based on search and filter query
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getTutors(req, res) {
  try {
    const response = await usersServices.getTutors(req.query);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to get tutors", status: "failure" });
  }
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
