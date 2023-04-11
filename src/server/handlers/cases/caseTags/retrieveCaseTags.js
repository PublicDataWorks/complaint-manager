import models from "../../../policeDataManager/models";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";

const asyncMiddleWare = require("../../asyncMiddleware");

const retrieveCaseTags = asyncMiddleWare(async (request, response) => {
  const caseTags = await models.sequelize.transaction(async transaction => {
    const caseTagsAndAuditDetails = await getAllCaseTagsAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );

    const caseTags = caseTagsAndAuditDetails.caseTags;
    const auditDetails = caseTagsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_TAGS,
      auditDetails,
      transaction
    );
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

module.exports = retrieveCaseTags;
