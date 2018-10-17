const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");
const Boom = require("boom");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.id, async (err, job) => {
    if (err) {
      throw Boom.badRequest(`Could not find Job Id: ${request.params.id}`);
    }
    let downLoadUrl;
    if (job.result && job.state() === "complete") {
      downLoadUrl = await generateExportDownloadUrl(
        job.result.key,
        request.nickname
      );
    }
    response.json({ id: job.id, state: job.state(), downLoadUrl: downLoadUrl });
  });
});

module.exports = exportJob;
