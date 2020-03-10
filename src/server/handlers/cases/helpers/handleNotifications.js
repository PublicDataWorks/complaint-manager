const models = require("../../../complaintManager/models");

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
      const workingListIndex = workingListUsersEmails.indexOf(currentUser);
      workingListMentionedUsers.splice(workingListIndex);
    } else {
      await deleteNotification(transaction, request, currentUser, caseNoteId);
    }
  }

  for (const user in workingListMentionedUsers) {
    await createNotification(
      transaction,
      request,
      workingListMentionedUsers[user],
      caseNoteId
    );
  }
};

const createNotification = async (transaction, request, user, caseNoteId) => {
  await models.notification.create(
    {
      caseNoteId: caseNoteId,
      user: user.value
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

  currentNotification.changed("user", true);

  await currentNotification.save({ transaction, auditUser: request.nickname });
};
