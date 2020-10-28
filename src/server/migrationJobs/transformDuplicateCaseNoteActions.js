import models from "../policeDataManager/models";
import { updateDatabaseWithCorrectAttributeId } from "./transformDuplicateGenderIdentities";

export const transformDuplicateCaseNoteActionsId = async (
  caseNotesWithIncorrectCaseNoteActionIds,
  lastGoodCaseNoteAction,
  Op,
  transaction
) => {
  for (let i = 0; i < caseNotesWithIncorrectCaseNoteActionIds.length; i++) {
    const caseNoteRow = caseNotesWithIncorrectCaseNoteActionIds[i];
    const actionName = await models.case_note_action.findOne({
      attributes: ["name"],
      where: { id: caseNoteRow.caseNoteActionId }
    });

    if (actionName.name != null) {
      const correctId = await models.case_note_action.findOne({
        where: {
          name: actionName.name,
          id: { [Op.lte]: lastGoodCaseNoteAction }
        }
      });

      try {
        await updateDatabaseWithCorrectAttributeId(
          caseNoteRow,
          "caseNoteActionId",
          correctId,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while transforming duplicate case note action id for case note with id ${caseNoteRow.id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};
