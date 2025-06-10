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

export default {
  buildFailureResponse,
  buildSuccessResponse,
};
