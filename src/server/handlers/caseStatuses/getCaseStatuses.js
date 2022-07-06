import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const getCaseStatuses = asyncMiddleware(async (request, response, next) => {
  const queryOptions = {
    attributes: ["id", "name", "order_key"]
  };
  const caseStatuses = await models.caseStatus.findAll(queryOptions);

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.CASE_STATUSES,
    getQueryAuditAccessDetails(queryOptions, models.caseStatus.name),
    null
  );

  response.status(200).send(caseStatuses);
});

export default getCaseStatuses;
