import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";
import legacyAuditDataAccess from "../audits/legacyAuditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";

export const removeCaseTag = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseTagId = request.params.caseTagId;
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

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

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_TAGS,
        caseTagAuditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_TAGS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        caseTagAuditDetails
      );
    }

    return caseTags;
  });

  response.status(200).send(currentCase);
});
