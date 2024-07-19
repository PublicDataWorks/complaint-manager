const models = require("../../../policeDataManager/models");
import handleEmailNotifications from "./handleEmailNotifications";

export const handleNotifications = async (
  transaction,
  request,
  mentionedUsers,
  caseNoteId
) => {
  console.log("handleNotifications function called");
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
    console.log("mentioned users emails: ", mentionedUsersEmails);
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
    console.log("user:  ", user);
    const mentionedUserEmail = workingListMentionedUsers[user].value;
    const mentionedUser = workingListMentionedUsers[user].label;
    const caseNoteLink = request.caseLink;
    await createNotification(
      transaction,
      request,
      mentionedUserEmail,
      caseNoteId
    );
    console.log("Sending email notification to:", mentionedUser);
    usersWithNewNotifs.push(mentionedUser);

    try {
      await handleEmailNotifications(
        mentionedUser,
        caseNoteId,
        mentionedUserEmail,
        caseNoteLink
      );
    } catch (error) {
      console.log("Failed to send email notification:", error);
    }
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
