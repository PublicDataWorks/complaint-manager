import asyncMiddleware from "../asyncMiddleware";
import editTagAndAuditDetails from "./editTagHelper";

const editTag = asyncMiddleware(async (request, response, next) => {
  try {
    let result = editTagAndAuditDetails(
      request,
      request.params.id,
      request.body
    );

    response.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

export default editTag;
