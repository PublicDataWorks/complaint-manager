import _ from "lodash";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import { updateCaseToActiveIfInitial } from "../../cases/helpers/caseStatusHelpers";
import { getDirectiveId, getRuleChapterId } from "../officerAllegationHelpers";
import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  const caseWithAssociations = await models.sequelize.transaction(
    async transaction => {
      let allegationAttributes = {
        ruleChapterId: await getRuleChapterId(request),
        allegationId: request.body.allegationId,
        details: request.body.details,
        severity: request.body.severity,
        directiveId: await getDirectiveId(request),
        customDirective: request.body.directiveName
      };

      const caseOfficer = await models.case_officer.findByPk(
        request.params.caseOfficerId,
        { transaction }
      );

      await caseOfficer.createAllegation(
        allegationAttributes,
        {
          auditUser: request.nickname
        },
        { transaction }
      );

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
        caseOfficer.caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );

      return caseDetails;
    }
  );

  return response.status(201).send(await caseWithAssociations.toJSON());
});

export default createOfficerAllegation;
