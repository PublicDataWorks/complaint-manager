const asyncMiddleware = require("../../asyncMiddleware");
const config = require("../../../config/config");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");

const deleteAttachment = asyncMiddleware(async (request, response) => {
  const s3 = createConfiguredS3Instance();

  const deleteRequest = s3.deleteObject({
    Bucket: config[process.env.NODE_ENV].s3Bucket,
    Key: `${request.params.id}/${request.params.fileName}`
  });

  await deleteRequest.promise();

  await models.attachment.destroy({
    where: {
      fileName: request.params.fileName,
      caseId: request.params.id
    },
    auditUser: request.nickname
  });

  const caseDetails = await getCaseWithAllAssociations(request.params.id);
  response.status(200).send(caseDetails);
});

module.exports = deleteAttachment;
