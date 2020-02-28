const models = require("../../../complaintManager/models");

export const createNotification = async (
  mentionedUsers,
  requestBody,
  caseNoteId
) => {
  for (const user in mentionedUsers) {
    await models.notification.create({
      user: mentionedUsers[user].value,
      previewText: requestBody.notes,
      caseNoteId
    });
  }
};
