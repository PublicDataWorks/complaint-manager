const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");
const Boom = require("boom");
const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");

const exportJob = asyncMiddleware(async (request, response, next) => {
  console.log("job id passed to get:", request.params.id);
  kue.Job.get(request.params.id, async (err, job) => {
    if (err) {
      throw Boom.badRequest(`Could not find Job Id: ${request.params.id}`);
    }
    let downLoadUrl;
    console.log(
      "job if doesn't have result otherwise result:",
      job.result ? job.result : job
    );
    console.log("job id:", job.id);

    if (job.result && job.state() === "complete") {
      downLoadUrl = await generateExportDownloadUrl(
        job.result.key,
        request.nickname,
        JOB_OPERATION[job.data.name].auditSubject
      );
    }
    response.json({ id: job.id, state: job.state(), downLoadUrl: downLoadUrl });
  });
});

module.exports = exportJob;
