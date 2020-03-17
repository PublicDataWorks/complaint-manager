import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import generateExportDownloadUrl from "./generateExportDownloadUrl";
import getInstance from "./queueFactory";

const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");

const exportJob = asyncMiddleware(async (request, response, next) => {
  let downLoadUrl;
  let queue;

  queue = getInstance();

  const job = await queue.getJob(request.params.jobId);
  if (!job) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_JOB);
  }

  const jobState = await job.getState();
  if (jobState === "completed" && job.returnvalue) {
    downLoadUrl = await generateExportDownloadUrl(
      job.returnvalue.Key,
      request.nickname,
      job.data.name,
      job.data.dateRange
    );
  }
  response.json({
    id: job.id,
    state: jobState,
    downLoadUrl: downLoadUrl
  });
});

module.exports = exportJob;
