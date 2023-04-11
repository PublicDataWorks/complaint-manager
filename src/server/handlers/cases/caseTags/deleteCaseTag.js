import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";

const deleteCaseTag = asyncMiddleware(async (request, response) => {
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
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_TAGS,
      caseTagAuditDetails,
      transaction
    );

    return caseTags;
  });

  response.status(200).send(currentCase);
});

export default deleteCaseTag;
