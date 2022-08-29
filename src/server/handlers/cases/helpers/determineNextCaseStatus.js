import models from "../../../policeDataManager/models";

const QUERY_FOR_FIRST_STATUS = `
    SELECT id, name, order_key
        FROM case_statuses cs
        WHERE NOT EXISTS (
            SELECT name
                FROM case_statuses cs2
                WHERE cs.order_key > cs2.order_key
        )`;

const determineNextCaseStatus = async status => {
  if (!status) {
    const firstStatus = await models.sequelize.query(QUERY_FOR_FIRST_STATUS);
    return firstStatus[0][0];
  }

  const QUERY_FOR_NEXT_STATUS = `
    SELECT id, name, order_key
        FROM case_statuses cs
        WHERE cs.order_key = (
            SELECT order_key
                FROM case_statuses cs2
                WHERE name = '${status}'
        ) + 1`;

  const nextStatus = await models.sequelize.query(QUERY_FOR_NEXT_STATUS);
  return nextStatus[0][0];
};

export default determineNextCaseStatus;
