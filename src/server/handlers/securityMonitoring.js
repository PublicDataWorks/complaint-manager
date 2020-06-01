const securityMonitoring = async (request, response, next) => {
  const description = request.body.description;

  console.log("Heroku Security WebHook received.", description);

  console.log("Full Request", request);

  response.send(200);
};
module.exports = securityMonitoring;
