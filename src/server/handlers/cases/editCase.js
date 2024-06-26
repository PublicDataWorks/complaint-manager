import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import { updateCaseToActiveIfInitial } from "./helpers/caseStatusHelpers";

const moment = require("moment");
const models = require("../../policeDataManager/models");
const asyncMiddleware = require("../asyncMiddleware");
const _ = require("lodash");
const Boom = require("boom");

async function upsertAddress(caseId, incidentLocation, transaction, nickname) {
  if (!incidentLocation.id) {
    await models.address.create(
      {
        ...incidentLocation,
        addressableType: ADDRESSABLE_TYPE.CASES,
        addressableId: caseId
      },
      {
        transaction,
        auditUser: nickname
      }
    );
  } else {
    await models.address.update(incidentLocation, {
      where: { id: incidentLocation.id },
      transaction,
      auditUser: nickname
    });
  }
}

const editCase = asyncMiddleware(async (request, response, next) => {
  if (
    !request.body.firstContactDate ||
    !moment(request.body.firstContactDate).isValid()
  ) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_FIRST_CONTACT_DATE);
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    let valuesToUpdate = _.omit(request.body, [
      "createdBy",
      "caseReference",
      "year",
      "caseNumber"
    ]);

    if (request.body.incidentLocation) {
      await upsertAddress(
        request.params.caseId,
        request.body.incidentLocation,
        transaction,
        request.nickname
      );
    }

    let caseToUpdate = await models.cases.findByPk(request.params.caseId);
    if (valuesToUpdate.complaintType !== caseToUpdate.complaintType) {
      valuesToUpdate = await mapComplaintTypeToCaseAttributes(valuesToUpdate);
    }

    console.log(valuesToUpdate);
    await caseToUpdate.update(valuesToUpdate, {
      individualHooks: true,
      transaction,
      auditUser: request.nickname
    });

    await updateCaseToActiveIfInitial(
      request.params.caseId,
      request.nickname,
      transaction
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
  response.status(200).send(await updatedCase.toJSON());
});

const mapComplaintTypeToCaseAttributes = async caseAttributes => {
  let newCaseAttributes = caseAttributes;
  const complaintType = await models.complaintTypes.findOne({
    where: { name: newCaseAttributes.complaintType }
  });
  delete newCaseAttributes.complaintType;
  if (complaintType) {
    newCaseAttributes.complaintTypeId = complaintType.id;
  }

  return newCaseAttributes;
};

module.exports = editCase;
