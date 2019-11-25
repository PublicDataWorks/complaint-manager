import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";

const moment = require("moment");
const models = require("../../complaintManager/models");
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
  } else {
    const caseValidationToggle = checkFeatureToggleEnabled(
      request,
      "caseValidationFeature"
    );

    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const valuesToUpdate = _.omit(request.body, [
          "createdBy",
          "assignedTo"
        ]);

        if (request.body.incidentLocation) {
          await upsertAddress(
            request.params.caseId,
            request.body.incidentLocation,
            transaction,
            request.nickname
          );
        }

        const caseToUpdate = await models.cases.findByPk(request.params.caseId);
        await caseToUpdate.update(valuesToUpdate, {
          individualHooks: true,
          transaction,
          auditUser: request.nickname,
          validate: caseValidationToggle
        });

        const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
          request.params.caseId,
          transaction
        );
        const caseDetails = caseDetailsAndAuditDetails.caseDetails;
        const auditDetails = caseDetailsAndAuditDetails.auditDetails;

        await auditDataAccess(
          request.nickname,
          request.params.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails,
          transaction
        );

        return caseDetails;
      }
    );
    response.status(200).send(updatedCase);
  }
});

module.exports = editCase;
