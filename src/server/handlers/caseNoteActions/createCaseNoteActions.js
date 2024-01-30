import asyncMiddleWare from "../asyncMiddleware";

const createCaseNoteActions = asyncMiddleWare(
  async (request, response, next) => {
    response.send(200);
  }
);

export default createCaseNoteActions;
