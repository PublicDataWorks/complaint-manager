const asyncMiddleware = require("../../asyncMiddleware");
const config = require("../../../config/config");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const auditDataAccess = require("../../auditDataAccess");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const deleteAttachment = asyncMiddleware(async (request, response) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    const s3 = createConfiguredS3Instance();

    const deleteRequest = s3.deleteObject({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `${request.params.caseId}/${request.params.fileName}`
    });

    await deleteRequest.promise();

    await models.attachment.destroy({
      where: {
        fileName: request.params.fileName,
        caseId: request.params.caseId
      },
      auditUser: request.nickname,
      transaction
    });

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(request.params.caseId, transaction);
  });

  response.status(200).send(caseDetails);
});

module.exports = deleteAttachment;
