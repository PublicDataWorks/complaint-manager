import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");
const _ = require("lodash");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  console.log(request.body);
  const allegationAttributes = _.pick(request.body, [
    "allegationId",
    "details",
    "severity"
  ]);

  const caseWithAssociations = await models.sequelize.transaction(
    async transaction => {
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

  return response.status(201).send(caseWithAssociations);
});

export default createOfficerAllegation;
