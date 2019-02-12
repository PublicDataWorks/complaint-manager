const {
  buildOfficerAttributesForNewOfficer,
  buildOfficerAttributesForUnknownOfficer
} = require("../buildOfficerAttributesHelpers");

const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;

  const retrievedCase = await models.cases.findByPk(request.params.caseId);
  const referralLetter = await models.referral_letter.findOne({
    where: { caseId: request.params.caseId }
  });

  let caseOfficerAttributes = {};
  if (!officerId) {
    caseOfficerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else {
    caseOfficerAttributes = await buildOfficerAttributesForNewOfficer(
      officerId
    );
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    const createdCaseOfficer = await retrievedCase.createAccusedOfficer(
      { notes, roleOnCase, ...caseOfficerAttributes },
      {
        transaction,
        auditUser: request.nickname
      }
    );

    if (referralLetter) {
      await models.letter_officer.create(
        { caseOfficerId: createdCaseOfficer.id },
        { transaction, auditUser: request.nickname }
      );
    }

    await auditDataAccess(
      request.nickname,
      retrievedCase.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(retrievedCase.id, transaction);
  });

  return response.send(updatedCase);
});

module.exports = addCaseOfficer;
