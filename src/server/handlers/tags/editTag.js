import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import editTagAndAuditDetails from "./editTagHelper";

const editTag = asyncMiddleware(async (request, response, next) => {
  try {
    let result = await editTagAndAuditDetails(
      request,
      request.params.id,
      request.body
    );

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default editTag;
