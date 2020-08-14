import models from "../../../complaintManager/models";
import sequelize from "sequelize";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  DESCENDING,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";

export const executeQuery = async nickname => {
  const date = new Date();

  const endDate = date.setFullYear(date.getFullYear(), date.getMonth(), 0);

  const startDate = date.setFullYear(
    date.getFullYear() - 1,
    date.getMonth(),
    1
  );

  const where = {
    deletedAt: null,
    firstContactDate: {
      [sequelize.Op.gte]: startDate,
      [sequelize.Op.lte]: endDate
    },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: [
      "tag.name",
      [sequelize.fn("COUNT", sequelize.col("case_tag.case_id")), "count"]
    ],
    include: [
      {
        model: models.tag,
        as: "tag",
        attributes: []
      },
      {
        model: models.cases,
        where: where,
        attributes: []
      }
    ],
    raw: true,
    group: "tag.name",
    limit: 10,
    order: [["count", DESCENDING]]
  };

  const countByTop10Tags = await models.sequelize.transaction(
    async transaction => {
      const countByTop10Tags = await models.case_tag.findAll(queryOptions);
      const auditDetails = getQueryAuditAccessDetails(
        queryOptions,
        models.case_tag.name
      );

      await auditDataAccess(
        nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.VISUALIZATION_TOP_10_TAGS,
        auditDetails,
        transaction
      );
      return countByTop10Tags;
    }
  );

  return countByTop10Tags;
};
