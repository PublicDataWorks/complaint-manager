import asyncMiddleWare from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const createCaseNoteActions = asyncMiddleWare(
  async (request, response, next) => {
    try {
      const caseNoteAction = await models.case_note_action.create({
        name: request.body.name
      });
      response.status(201).send(caseNoteAction);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

export default createCaseNoteActions;
