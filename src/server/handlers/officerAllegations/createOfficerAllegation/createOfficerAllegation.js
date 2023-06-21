import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";
import { updateCaseToActiveIfInitial } from "../../cases/helpers/caseStatusHelpers";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");
const _ = require("lodash");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  let ruleChapter;
  if (request.body.ruleChapterId) {
    ruleChapter = await models.ruleChapter.findByPk(request.body.ruleChapterId);
    if (!ruleChapter) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_RULE_CHAPTER);
    }
  } else if (request.body.ruleChapterName) {
    ruleChapter = await models.ruleChapter.create({
      name: request.body.ruleChapterName
    });
  }

  let allegationAttributes = {
    ruleChapterId: ruleChapter?.id,
    allegationId: request.body.allegationId,
    details: request.body.details,
    severity: request.body.severity
  };

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
