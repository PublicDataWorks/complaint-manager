import asyncMiddleWare from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const retrieveCaseNoteActions = asyncMiddleWare(
  async (request, response, next) => {
    const caseNoteActions = await models.case_note_action.findAll({
      attributes: ["name", "id"],
      raw: true
    });
    const caseNoteActionValues = caseNoteActions.map(caseNoteAction => {
      return [caseNoteAction.name, caseNoteAction.id];
    });

    response.status(200).send(caseNoteActionValues);
  }
);

export default retrieveCaseNoteActions;
