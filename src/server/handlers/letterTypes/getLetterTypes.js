import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const getLetterTypes = asyncMiddleware(async (request, response, next) => {
  const queryOptions = {
    attributes: [
      "id",
      "type",
      "template",
      "editableTemplate",
      "requiresApproval",
      "hasEditPage"
    ]
  };
  const letterTypes = await models.letter_types.findAll(queryOptions);

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.LETTER_TYPES,
    getQueryAuditAccessDetails(queryOptions, models.letter_types.type),
    null
  );

  response.status(200).send(await letterTypes);
});

export default getLetterTypes;
