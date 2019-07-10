import models from "../../../models";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";

const asyncMiddleWare = require("../../asyncMiddleware");

const getCaseTags = asyncMiddleWare(async (request, response) => {
  const caseTags = await models.sequelize.transaction(async transaction => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const caseTagsAndAuditDetails = await getAllCaseTagsAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );

    const caseTags = caseTagsAndAuditDetails.caseTags;
    const auditDetails = caseTagsAndAuditDetails.auditDetails;

    // TODO remove following when removing newAuditFeature flag
    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_TAGS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_TAGS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseTags;
  });
  response.send(caseTags);
});

const getAllCaseTagsAndAuditDetails = async (caseId, nickname, transaction) => {
  const queryOptions = {
    where: {
      caseId: caseId
    },
    include: [
      {
        model: models.tag,
        as: "tag"
      }
    ],
    auditUser: nickname,
    transaction
  };
  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.case_tag.name
  );

  const caseTags = await models.case_tag.findAll(queryOptions);
  return { caseTags: caseTags, auditDetails: auditDetails };
};

module.exports = getCaseTags;
