const newRelic = require("newrelic");
const Boom = require("boom");

const errorHandler = (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);
  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
    response
      .status(boomError.output.statusCode)
      .json({ ...boomError.output.payload, message: "Something went wrong!" });
  } else {
    response.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

module.exports = errorHandler;
