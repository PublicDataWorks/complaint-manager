import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
import generateExportDownloadUrl from "./generateExportDownloadUrl";
const Boom = require("boom");
const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");

const exportJob = asyncMiddleware(async (request, response, next) => {
  kue.Job.get(request.params.jobId, async (err, job) => {
    if (err) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_JOB);
    }
    let downLoadUrl;

    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    if (job.result && job.state() === "complete") {
      downLoadUrl = await generateExportDownloadUrl(
        job.result.Key,
        request.nickname,
        job.data.name,
        job.data.dateRange,
        newAuditFeatureToggle
      );
    }

    response.json({ id: job.id, state: job.state(), downLoadUrl: downLoadUrl });
  });
});

module.exports = exportJob;
