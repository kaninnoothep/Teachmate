/**
 * Import Modules
 */
import express from "express";
import userControllers from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.js";
import auth from "../middlewares/auth.js";

// Define Router object for all /user routes
const router = express.Router();

// POST request to /create-account
router.post("/create-account", userControllers.createAccount);

// POST request to /login
router.post("/login", userControllers.login);

// POST request to /update-user
router.post(
  "/update-user",
  authMiddleware.authenticate,
  userControllers.updateUser
);

// POST request to /set-availability
router.post(
  "/set-availability",
  authMiddleware.authenticate,
  userControllers.setAvailability
);

// GET request to /get-availability
router.get(
  "/get-availability",
  authMiddleware.authenticate,
  userControllers.getAvailability
);

/**
 * Export router object
 */
export default router;
