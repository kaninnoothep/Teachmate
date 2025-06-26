/**
 * Builds a standardized failure response object.
 *
 * @param {string} message - A short description of the error or failure.
 * @param {number} statusCode - The HTTP status code representing the error.
 * @param {*} [data] - Optional additional data or details related to the error.
 * @returns {Object} A structured failure response object.
 */
const buildFailureResponse = (message, statusCode, data) => {
  if (data) {
    return {
      message,
      statusCode,
      status: "failure",
      data,
    };
  }

  return {
    message,
    statusCode,
    status: "failure",
  };
};

/**
 * Builds a standardized success response object.
 *
 * @param {string} message - A short description of the success event.
 * @param {number} statusCode - The HTTP status code representing the success.
 * @param {*} [data] - Optional data or payload to return with the success.
 * @returns {Object} A structured success response object.
 */
const buildSuccessResponse = (message, statusCode, data) => {
  if (data) {
    return {
      message,
      statusCode,
      status: "success",
      data,
    };
  }
  return {
    message,
    statusCode,
    status: "success",
  };
};

// Export the utility functions
export default {
  buildFailureResponse,
  buildSuccessResponse,
};
