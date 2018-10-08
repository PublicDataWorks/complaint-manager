const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.id, async function(err, job) {
    if (err) {
      response.sendStatus(500, err);
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
