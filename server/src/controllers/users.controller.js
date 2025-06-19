/**
 * Import modules
 */
import usersServices from "../services/users.services.js";

/**
 * createAccount - create a new user account
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
 * setAvailability - Set availability for the authenticated user
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
 * getAvailability - Get availability for the authenticated user
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
 * setPreferredLocation - Set preferred locations for the authenticated user
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
 * getPreferredLocation - Get preferred locations for the authenticated user
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
 * Export all fuctions
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
