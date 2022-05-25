import {
  ACCUSED,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import {
  buildOfficerAttributesForNewOfficer,
  buildOfficerAttributesForUnknownOfficer
} from "../helpers/buildOfficerAttributesHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import canBeAnonymous from "../helpers/canBeAnonymous";
import { sendNotifsIfComplainantChange } from "../../sendNotifsIfComplainantChange";

const models = require("../../../policeDataManager/models");
const asyncMiddleware = require("../../asyncMiddleware");

const editCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase, phoneNumber, email } = request.body;
  const isAnonymous = canBeAnonymous(request.body.isAnonymous, roleOnCase);
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    }
  });

  const updatedCase = await models.sequelize.transaction(async transaction => {
    const oldRoleOnCase = caseOfficerToUpdate.roleOnCase;
    if (oldRoleOnCase === ACCUSED && roleOnCase !== ACCUSED) {
      await models.officer_allegation.destroy({
        where: { caseOfficerId: caseOfficerToUpdate.id },
        auditUser: request.nickname,
        transaction
      });
      await models.letter_officer.destroy({
        where: { caseOfficerId: caseOfficerToUpdate.id },
        auditUser: request.nickname,
        transaction
      });
    }

    if (oldRoleOnCase !== ACCUSED && roleOnCase === ACCUSED) {
      await models.letter_officer.create(
        { caseOfficerId: caseOfficerToUpdate.id },
        { auditUser: request.nickname, transaction }
      );
    }

    let officerAttributes = {};
    if (!officerId) {
      officerAttributes = buildOfficerAttributesForUnknownOfficer();
    } else if (officerId !== caseOfficerToUpdate.officerId) {
      officerAttributes = await buildOfficerAttributesForNewOfficer(
        officerId,
        caseOfficerToUpdate.caseEmployeeType,
        phoneNumber,
        email
      );
    } else {
      officerAttributes.phoneNumber = phoneNumber;
      officerAttributes.email = email;
    }

    await caseOfficerToUpdate.update(
      {
        notes,
        roleOnCase,
        isAnonymous,
        ...officerAttributes
      },
      {
        auditUser: request.nickname,
        transaction
      }
    );

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

  response.status(200).send(updatedCase);

  await sendNotifsIfComplainantChange(updatedCase.id);
});

module.exports = editCaseOfficer;
