const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");
const Boom = require("boom");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.id, async (err, job) => {
    if (err) {
      throw Boom.badRequest(`Could not find Job Id: ${request.params.id}`);
    }
    if (job.result && job.state() === "complete") {
      job.result.downLoadUrl = await generateExportDownloadUrl(
        job.result.key,
        request.nickname
      );
    }
    response.json(job);
  });
});

module.exports = exportJob;
