/**
 * Import modules
 */
import multer from "multer";

/**
 * Set up file storage configuration using multer
 * Files will retain their original name
 */
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// Create the upload middleware using the configured storage
const upload = multer({ storage });

export default upload;
