import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";

const asyncMiddleware = require("../../asyncMiddleware");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const models = require("../../../policeDataManager/models/index");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");

const deleteAttachment = asyncMiddleware(async (request, response) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    const s3 = createConfiguredS3Instance();
    const deleteRequest = s3.deleteObject({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `${request.params.caseId}/${request.query.fileName}`
    });

    await deleteRequest.promise();

    await models.attachment.destroy({
      where: {
        fileName: request.query.fileName,
        caseId: request.params.caseId
      },
      auditUser: request.nickname,
      transaction
    });

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        request.params.caseId,
        transaction,
        request.permissions
      );

    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;
    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );
    return caseDetails;
  });

  response.status(200).send(await caseDetails.toJSON());
});

module.exports = deleteAttachment;
