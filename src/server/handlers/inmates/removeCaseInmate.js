import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import { sendNotifsIfComplainantChange } from "../sendNotifsIfComplainantChange";
import { updateCaseToActiveIfInitial } from "../cases/helpers/caseStatusHelpers";
import models from "../../policeDataManager/models";
import asyncMiddleware from "../asyncMiddleware";
import Boom from "boom";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";

const removeCaseInmate = asyncMiddleware(async (request, response, next) => {
  const inmateToRemove = await models.case_inmate.findByPk(
    request.params.caseInmateId
  );

  if (inmateToRemove === null) {
    next(Boom.badRequest(BAD_REQUEST_ERRORS.REMOVE_CASE_INMATE_ERROR));
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    await inmateToRemove.destroy({
      auditUser: request.nickname,
      transaction
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

  await sendNotifsIfComplainantChange(updatedCase.id);
});

export default removeCaseInmate;
