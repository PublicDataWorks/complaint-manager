const timezone = require("moment-timezone");
const { TIMEZONE } = require("../../../sharedUtilities/constants");
const config = require("../../../server/config/config")[process.env.NODE_ENV];

const createConfiguredS3Instance = require("../../../server/createConfiguredS3Instance");

const fileName = (jobId, exportFileName) => {
  const date = timezone()
    .tz(TIMEZONE)
    .format("YYYY-MM-DD_HH.mm.ss.zz");

  return `cases/${jobId}/Complaint_Manager_${exportFileName}_${date}.csv`;
};

const uploadFileToS3 = (
  jobId,
  csvOutput,
  exportFileName,
  s3 = createConfiguredS3Instance()
) => {
  return s3
    .upload({
      Bucket: config.exportsBucket,
      Key: fileName(jobId, exportFileName),
      Body: csvOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

module.exports = uploadFileToS3;
