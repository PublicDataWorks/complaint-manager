import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";
import { AUDIT_SUBJECT } from "../../../sharedUtilities/constants";

export const removeCaseTag = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseTagId = request.params.caseTagId;

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_tag.destroy({
      where: {
        id: caseTagId
      },
      transaction,
      auditUser: request.nickname
    });

    const caseTagQueryOptions = {
      where: { caseId },
      include: [
        {
          model: models.tag,
          as: "tag"
        }
      ],
      transaction
    };

    const caseTags = await models.case_tag.findAll(caseTagQueryOptions);
    const caseTagAuditDetails = getQueryAuditAccessDetails(
      caseTagQueryOptions,
      models.case_tag.name
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_TAGS,
      caseTagAuditDetails,
      transaction
    );

    return caseTags;
  });

  response.status(200).send(currentCase);
});
