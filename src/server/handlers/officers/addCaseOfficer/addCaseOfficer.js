import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import canBeAnonymous from "../helpers/canBeAnonymous";
import { sendNotifsIfComplainantChange } from "../../sendNotifsIfComplainantChange";
import { updateCaseToActiveIfInitial } from "../../cases/helpers/caseStatusHelpers";

const {
  buildOfficerAttributesForNewOfficer,
  buildOfficerAttributesForUnknownOfficer
} = require("../helpers/buildOfficerAttributesHelpers");

const models = require("../../../policeDataManager/models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const {
    officerId,
    notes,
    roleOnCase,
    caseEmployeeType = "Officer",
    phoneNumber,
    email
  } = request.body;
  const isAnonymous = canBeAnonymous(request.body.isAnonymous, roleOnCase);

  const retrievedCase = await models.cases.findByPk(request.params.caseId);
  const referralLetter = await models.referral_letter.findOne({
    where: { caseId: request.params.caseId }
  });

  let caseOfficerAttributes = {};
  if (!officerId) {
    caseOfficerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else {
    caseOfficerAttributes = await buildOfficerAttributesForNewOfficer(
      officerId,
      caseEmployeeType,
      phoneNumber,
      email
    );
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    const createdCaseOfficer = await retrievedCase.createAccusedOfficer(
      { notes, roleOnCase, isAnonymous, ...caseOfficerAttributes },
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

    await updateCaseToActiveIfInitial(
      retrievedCase.id,
      request.nickname,
      transaction
    );

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        retrievedCase.id,
        transaction,
        request.permissions
      );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      retrievedCase.id,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );

    return caseDetails;
  });

  response.status(200).send(await updatedCase.toJSON());

  await sendNotifsIfComplainantChange(updatedCase.id);
});

module.exports = addCaseOfficer;
