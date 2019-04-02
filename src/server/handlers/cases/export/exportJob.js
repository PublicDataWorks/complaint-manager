import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");
const Boom = require("boom");
const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.jobId, async (err, job) => {
    if (err) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_JOB);
    }
    let downLoadUrl;

    if (job.result && job.state() === "complete") {
      downLoadUrl = await generateExportDownloadUrl(
        job.result.Key,
        request.nickname,
        JOB_OPERATION[job.data.name].auditSubject,
        job.data.dateRange
      );
    }

    response.json({ id: job.id, state: job.state(), downLoadUrl: downLoadUrl });
  });
});

module.exports = exportJob;
