const models = require("../../../complaintManager/models");

export const createNotification = async (mentionedUsers, caseNoteId) => {
  for (const user in mentionedUsers) {
    await models.notification.create({
      user: mentionedUsers[user].value,
      caseNoteId
    });
  }
};
