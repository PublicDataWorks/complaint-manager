import asyncMiddleWare from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const createCaseNoteActions = asyncMiddleWare(
  async (request, response, next) => {
    const caseNoteAction = await models.sequelize.transaction(
      async transaction =>
        (actionTaken = await models.case_note_action.create({
          name: request.body.name
        }))
    );
    response.send(200);
  }
);

export default createCaseNoteActions;
