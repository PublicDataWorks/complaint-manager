const asyncMiddleware = require("../../asyncMiddleware");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");

const downloadAttachment = asyncMiddleware((request, response, next) => {
  const s3 = createConfiguredS3Instance();

  response.attachment(request.params.fileName);

  s3
    .getObject({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `${request.params.id}/${request.params.fileName}`
    })
    .createReadStream()
    .pipe(response);
});

module.exports = downloadAttachment;
