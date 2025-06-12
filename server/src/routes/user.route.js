/**
 * Import Modules
 */
import express from "express";
import userControllers from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// Define Router object for all /user routes
const router = express.Router();

// USER
// POST request to /create-account
router.post("/create-account", userControllers.createAccount);

// POST request to /login
router.post("/login", userControllers.login);

// GET request to /get-user/:userId
router.get(
  "/get-user/:userId",
  authMiddleware.authenticate,
  userControllers.getUser
);

// POST request to /update-user
router.post(
  "/update-user",
  authMiddleware.authenticate,
  userControllers.updateUser
);

router.post(
  "/upload-image",
  authMiddleware.authenticate,
  upload.single("image"),
  userControllers.uploadImage
);

// AVAILABILITY
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

// PREFERRED LOCATION
// POST request to /set-preferred-location
router.post(
  "/set-preferred-location",
  authMiddleware.authenticate,
  userControllers.setPreferredLocation
);

// GET request to /get-preferred-location
router.get(
  "/get-preferred-location",
  authMiddleware.authenticate,
  userControllers.getPreferredLocation
);

// EDUCATION
router.post(
  "/education",
  authMiddleware.authenticate,
  userControllers.addEducation
);
router.get(
  "/education",
  authMiddleware.authenticate,
  userControllers.getEducations
);
router.put(
  "/education/:id",
  authMiddleware.authenticate,
  userControllers.updateEducation
);
router.delete(
  "/education/:id",
  authMiddleware.authenticate,
  userControllers.deleteEducation
);

// EXPERIENCE
router.post(
  "/experience",
  authMiddleware.authenticate,
  userControllers.addExperience
);
router.get(
  "/experience",
  authMiddleware.authenticate,
  userControllers.getExperiences
);
router.put(
  "/experience/:id",
  authMiddleware.authenticate,
  userControllers.updateExperience
);
router.delete(
  "/experience/:id",
  authMiddleware.authenticate,
  userControllers.deleteExperience
);

// SESSIONS
router.post(
  "/sessions",
  authMiddleware.tutorAuthenticate,
  userControllers.addSession
);
router.get(
  "/sessions",
  authMiddleware.tutorAuthenticate,
  userControllers.getSessions
);
router.put(
  "/sessions/:id",
  authMiddleware.tutorAuthenticate,
  userControllers.updateSession
);
router.delete(
  "/sessions/:id",
  authMiddleware.tutorAuthenticate,
  userControllers.deleteSession
);

/**
 * Export router object
 */
export default router;
