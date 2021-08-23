import asyncMiddleware from "../asyncMiddleware";
import removeTagAndAuditDetails from "./removeTagHelper";


const removeTag = asyncMiddleware(async (request, response, next) => {
  try {
    await removeTagAndAuditDetails(
      request,
      request.params.id
    );
    response.status(204).send({});
  } catch (error) {
    next(error);
  }
});

export default removeTag;
