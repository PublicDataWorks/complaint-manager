import asyncMiddleware from "../asyncMiddleware";
import mergeTagAndAuditDetails from "./mergeTagHelper";


const mergeTag = asyncMiddleware(async (request, response, next) => {
  try {
    await mergeTagAndAuditDetails(
      request,
      request.params.id,
      request.body.mergeTagId
    );
    response.status(200).send({id: mergeTagId});
  } catch (error) {
    next(error);
  }
});

export default mergeTag;
