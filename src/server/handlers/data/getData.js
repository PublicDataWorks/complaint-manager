import asyncMiddleware from "../asyncMiddleware";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

const getData = asyncMiddleware(async (request, response, next) => {
  let data;
  const queryType = request.query.queryType;

  switch (queryType) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      data = await countComplaintsByIntakeSource.executeQuery();
      break;
  }
  response.status(200).send(data);
});

export default getData;
