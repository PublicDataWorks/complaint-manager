const models = require("../../../policeDataManager/models");
import { handleEmailNotification } from "./handleEmailNotifications";
export const handleNotifications = async (
  transaction,
  request,
  mentionedUsers,
  caseNoteId
) => {
  const workingListMentionedUsers = [...mentionedUsers];
  const workingListUsersEmails = workingListMentionedUsers.map(user => {
    return user.value;
  });
  const usersWithNewNotifs = [];

  const allNotifications = await models.notification.findAll({
    where: {
      caseNoteId: caseNoteId
    }
  });

  for (const notification in allNotifications) {
    const currentUser = allNotifications[notification].user;
    const mentionedUsersEmails = mentionedUsers.map(user => {
      return user.value;
    });
    if (mentionedUsersEmails.includes(currentUser)) {
      await updateNotification(transaction, request, currentUser, caseNoteId);
      usersWithNewNotifs.push(currentUser);
      const workingListIndex = workingListUsersEmails.indexOf(currentUser);
      workingListUsersEmails.splice(workingListIndex, 1);
      workingListMentionedUsers.splice(workingListIndex, 1);
    } else {
      await deleteNotification(transaction, request, currentUser, caseNoteId);
      usersWithNewNotifs.push(currentUser);
    }
  }

  for (const user in workingListMentionedUsers) {
    const mentionedUser = workingListMentionedUsers[user].value;
    const mentionedUserEmail = workingListMentionedUsers[user].label;
    await createNotification(transaction, request, mentionedUser, caseNoteId);
    usersWithNewNotifs.push(mentionedUser);
    handleEmailNotification(mentionedUser, caseNoteId, mentionedUserEmail);
  }

  return usersWithNewNotifs;
};

const createNotification = async (transaction, request, user, caseNoteId) => {
  await models.notification.create(
    {
      caseNoteId: caseNoteId,
      user: user
    },
    {
      transaction,
      auditUser: request.nickname
    }
  );
};

const deleteNotification = async (transaction, request, user, caseNoteId) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });

  await currentNotification.destroy({
    transaction,
    auditUser: request.nickname
  });
};

const updateNotification = async (transaction, request, user, caseNoteId) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });

  if (currentNotification.hasBeenRead) {
    await currentNotification.update(
      { hasBeenRead: false },
      { auditUser: request.nickname }
    );
  }

  currentNotification.changed("updatedAt", true);

  await currentNotification.save({ transaction, auditUser: request.nickname });
};
