import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const models = require("../../../policeDataManager/models");
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";
import { updateCaseToActiveIfInitial } from "../../cases/helpers/caseStatusHelpers";
const _ = require("lodash");

const editOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const officerAllegation = await models.officer_allegation.findByPk(
          request.params.officerAllegationId,
          { transaction }
        );

        if (!officerAllegation) {
          throw Boom.badRequest(
            BAD_REQUEST_ERRORS.OFFICER_ALLEGATION_NOT_FOUND
          );
        }

        const allegationAttributes = _.pick(request.body, [
          "details",
          "severity"
        ]);

        await officerAllegation.update(allegationAttributes, {
          auditUser: request.nickname,
          transaction
        });

        const caseOfficer = await officerAllegation.getCaseOfficer({
          transaction
        });

        await updateCaseToActiveIfInitial(
          caseOfficer.caseId,
          request.nickname,
          transaction
        );

        const caseDetailsAndAuditDetails =
          await getCaseWithAllAssociationsAndAuditDetails(
            caseOfficer.caseId,
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

    response.status(200).send(await updatedCase.toJSON());
  }
);

module.exports = editOfficerAllegation;
