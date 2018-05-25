const errorHandler = (error, request, response, next) => {
  if (error.isServer) {
    response
      .status(error.output.statusCode)
      .json({ ...error.output.payload, message: "Something went wrong!" });
  } else {
    response.status(error.output.statusCode).json(error.output.payload);
  }
};

module.exports = errorHandler;
