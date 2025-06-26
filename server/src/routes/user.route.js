/**
 * Import Modules
 */
import express from "express";
import userControllers from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// Define Router object for all /user routes
const router = express.Router();

// USER
// Create an account
// POST request to /create-account
router.post("/create-account", userControllers.createAccount);

// Login
// POST request to /login
router.post("/login", userControllers.login);

// Get a user details by ID
// GET request to /get-user/:userId
router.get(
  "/get-user/:userId",
  authMiddleware.authenticate,
  userControllers.getUser
);

// Update user profile
// POST request to /update-user
router.post(
  "/update-user",
  authMiddleware.authenticate,
  userControllers.updateUser
);

// Upload a profile image
// POST request to /upload-image
router.post(
  "/upload-image",
  authMiddleware.authenticate,
  upload.single("image"),
  userControllers.uploadImage
);

// Get tutors
// GET request to /tutors
router.get(
  "/tutors",
  authMiddleware.studentAuthenticate,
  userControllers.getTutors
);

// AVAILABILITY
// Set or update availability
// POST request to /set-availability
router.post(
  "/set-availability",
  authMiddleware.authenticate,
  userControllers.setAvailability
);

// Get availability
// GET request to /get-availability
router.get(
  "/get-availability",
  authMiddleware.authenticate,
  userControllers.getAvailability
);

// PREFERRED LOCATION
// Set preferred location
// POST request to /set-preferred-location
router.post(
  "/set-preferred-location",
  authMiddleware.authenticate,
  userControllers.setPreferredLocation
);

// Get preferred location
// GET request to /get-preferred-location
router.get(
  "/get-preferred-location",
  authMiddleware.authenticate,
  userControllers.getPreferredLocation
);

// EDUCATION
// Add an education record
// POST request to /education
router.post(
  "/education",
  authMiddleware.authenticate,
  userControllers.addEducation
);

// Get user's education records
// GET request to /educaiton
router.get(
  "/education",
  authMiddleware.authenticate,
  userControllers.getEducations
);

// Update an education record by ID
// PUT request to /educaiton/:id
router.put(
  "/education/:id",
  authMiddleware.authenticate,
  userControllers.updateEducation
);

// Delete an education record by ID
// DELETE request to /educaiton/:id
router.delete(
  "/education/:id",
  authMiddleware.authenticate,
  userControllers.deleteEducation
);

// EXPERIENCE
// Add an experience record
// POST request to /experience
router.post(
  "/experience",
  authMiddleware.authenticate,
  userControllers.addExperience
);

// Get user's experience records
// GET request to /experience
router.get(
  "/experience",
  authMiddleware.authenticate,
  userControllers.getExperiences
);

// Update an experience record by ID
// PUT request to /experience/:id
router.put(
  "/experience/:id",
  authMiddleware.authenticate,
  userControllers.updateExperience
);

// Delete an experience record by ID
// DELETE request to /experience/:id
router.delete(
  "/experience/:id",
  authMiddleware.authenticate,
  userControllers.deleteExperience
);

// SESSIONS
// Add an sessions record for the tutor
// POST request to /sessions
router.post(
  "/sessions",
  authMiddleware.tutorAuthenticate,
  userControllers.addSession
);

// Get tutor's sessions
// GET request to /sessions
router.get(
  "/sessions",
  authMiddleware.tutorAuthenticate,
  userControllers.getSessions
);

// Update a session by ID
// PUT request to /sessions/:id
router.put(
  "/sessions/:id",
  authMiddleware.tutorAuthenticate,
  userControllers.updateSession
);

// Delete a session by ID
// DELETE request to /sessions/:id
router.delete(
  "/sessions/:id",
  authMiddleware.tutorAuthenticate,
  userControllers.deleteSession
);

/**
 * Export router object
 */
export default router;
