import asyncMiddleware from "../asyncMiddleware";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

const getData = asyncMiddleware(async (request, response, next) => {
  let data;
  const queryType = request.query.queryType;

  switch (queryType) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      data = await countComplaintsByIntakeSource.executeQuery();
      break;
    default:
      return next(
        Boom.badRequest(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
      );
  }
  response.status(200).send(data);
});

export default getData;
