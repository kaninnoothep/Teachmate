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
 * Export all fuctions
 */
export default {
  createAccount,
  login,
  updateUser,
  setAvailability,
  getAvailability,
};
