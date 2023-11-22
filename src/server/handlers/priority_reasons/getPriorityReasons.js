import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { ASCENDING } from "../../../sharedUtilities/constants";

const getPriorityReasons = asyncMiddleware(async (request, response, next) => {
  const priorityReasons = await models.priority_reasons.findAll({
    attributes: ["name", "id"],
    order: [["name", ASCENDING]],
    raw: true
  });
  const priorityReasonValues = priorityReasons.map(priorityReason => {
    return { name: priorityReason.name, id: priorityReason.id };
  });
  response.status(200).send(priorityReasonValues);
});

export default getPriorityReasons;
