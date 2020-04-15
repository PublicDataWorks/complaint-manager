const models = require("../../../complaintManager/models");

export const isCaseNoteAuthor = async (user, caseNoteId) => {
  const caseNote = await models.case_note.findByPk(caseNoteId);
  if (!caseNote) throw new Error("Case note does not exist.");
  return caseNote.user === user;
};
