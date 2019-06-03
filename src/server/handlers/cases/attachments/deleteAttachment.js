import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";

const asyncMiddleware = require("../../asyncMiddleware");
const config = require("../../../config/config");
const models = require("../../../models/index");
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const deleteAttachment = asyncMiddleware(async (request, response) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    const s3 = createConfiguredS3Instance();
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

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

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseDetails;
  });

  response.status(200).send(caseDetails);
});

module.exports = deleteAttachment;
