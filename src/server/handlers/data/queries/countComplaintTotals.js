import models from "../../../complaintManager/models";
import sequelize from "sequelize";
import {
  CASE_STATUS,
  MANAGER_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";

export const executeQuery = async nickname => {
  const getCountByDateRange = async (startDate, endDate, auditSubject) => {
    const where = {
      deletedAt: null,
      firstContactDate: {
        [sequelize.Op.gte]: startDate,
        [sequelize.Op.lte]: endDate
      },
      status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
    };

    const queryOptions = {
      where: where,
      attributes: []
    };

    const complaints = await models.sequelize.transaction(async transaction => {
      const complaints = await models.cases.findAll(queryOptions);
      const auditDetails = getQueryAuditAccessDetails(
        queryOptions,
        models.cases.name
      );

      await auditDataAccess(
        nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        auditSubject,
        auditDetails,
        transaction
      );
      return complaints;
    });
    return complaints.length;
  };

  const currentDate = new Date();

  const firstDayCurrentYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear(), 0, 1)
  );

  const countCurrentYear = await getCountByDateRange(
    firstDayCurrentYear,
    new Date(),
    AUDIT_SUBJECT.COMPLAINT_TOTAL_YTD
  );

  const firstDayPreviousYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear() - 1, 0, 1)
  );
  const lastDayPreviousYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear(), 11, 31)
  );

  const countPreviousYear = await getCountByDateRange(
    firstDayPreviousYear,
    lastDayPreviousYear,
    AUDIT_SUBJECT.COMPLAINT_TOTAL_PREVIOUS_YEAR
  );

  return { ytd: countCurrentYear, previousYear: countPreviousYear };
};
