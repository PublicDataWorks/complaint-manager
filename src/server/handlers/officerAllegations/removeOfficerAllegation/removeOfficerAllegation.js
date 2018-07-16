const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const models = require("../../../models");
const Boom = require("boom");

const removeOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const officerAllegation = await models.officer_allegation.findById(
          request.params.officerAllegationId,
          { transaction }
        );

        if (!officerAllegation) {
          next(Boom.notFound("Officer Allegation does not exist"));
        }

        await officerAllegation.destroy({
          auditUser: request.nickname,
          transaction
        });

        const caseOfficer = await officerAllegation.getCaseOfficer({
          transaction
        });

        await models.action_audit.create(
          {
            caseId: caseOfficer.caseId,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            user: request.nickname,
            action: DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS
          },
          { transaction }
        );

        return await getCaseWithAllAssociations(
          caseOfficer.caseId,
          transaction
        );
      }
    );

    response.status(200).send(updatedCase);
  }
);

module.exports = removeOfficerAllegation;
