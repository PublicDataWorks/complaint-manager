import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import models from "../../../complaintManager/models";

export const getNotificationAuditDetails = (caseNoteId, transaction) => {
  const queryOptions = {
    where: { caseNoteId: caseNoteId },
    transaction
  };

  return getQueryAuditAccessDetails(queryOptions, models.notification.name);
};
