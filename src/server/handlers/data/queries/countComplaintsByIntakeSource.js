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
  const date = new Date();
  const yearToDate = date.setFullYear(date.getFullYear(), 0, 1);

  const where = {
    deletedAt: null,
    firstContactDate: { [sequelize.Op.gte]: yearToDate },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: [
      "intakeSource.name",
      [sequelize.fn("COUNT", sequelize.col("cases.id")), "cases"]
    ],
    include: [
      {
        model: models.intake_source,
        as: "intakeSource",
        attributes: []
      }
    ],
    raw: true,
    group: "intakeSource.name",
    where: where
  };

  const complaintsByIntakeSource = await models.sequelize.transaction(
    async transaction => {
      const complaintsByIntakeSource = await models.cases.findAll(queryOptions);
      const auditDetails = getQueryAuditAccessDetails(
        queryOptions,
        models.cases.name
      );

      await auditDataAccess(
        nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.VISUALIZATION_INTAKE_SOURCE,
        auditDetails,
        transaction
      );
      return complaintsByIntakeSource;
    }
  );

  return complaintsByIntakeSource;
};
