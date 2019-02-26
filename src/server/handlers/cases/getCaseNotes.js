import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import { addToExistingAuditDetails } from "../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");
import auditDataAccess from "../auditDataAccess";

const getCaseNotes = asyncMiddleWare(async (request, response) => {
  const caseNotes = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const caseNotes = findAllCaseNotes(
      auditDetails,
      request.params.caseId,
      request.nickname,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_NOTES,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return caseNotes;
  });
  response.send(caseNotes);
});

const findAllCaseNotes = async (
  auditDetails,
  caseId,
  nickname,
  transaction
) => {
  const queryOptions = {
    where: {
      caseId: caseId
    },
    auditUser: nickname,
    transaction
  };

  addToExistingAuditDetails(auditDetails, queryOptions, models.case_note.name);

  return await models.case_note.findAll(queryOptions);
};

module.exports = getCaseNotes;
