import asyncMiddleware from "../asyncMiddleware";

const editTag = asyncMiddleware(async (request, response, next) => {
  response.status(200).send({});
});

export default editTag;
