const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.id, function(err, job) {
    if (err) {
      response.sendStatus(500, err);
    }
    response.json(job);
  });
});

module.exports = exportJob;
