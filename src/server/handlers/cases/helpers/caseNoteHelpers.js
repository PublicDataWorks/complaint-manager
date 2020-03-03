import Sequelize, { DataTypes } from "sequelize";
import moment from "moment";

const models = require("../../../complaintManager/models");

export const handleNotifications = async (mentionedUsers, caseNoteId) => {
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
      await updateNotification(currentUser, caseNoteId);
      const workingListIndex = workingListUsersEmails.indexOf(currentUser);
      workingListMentionedUsers.splice(workingListIndex);
    } else {
      await deleteNotification(currentUser, caseNoteId);
    }
  }

  for (const user in workingListMentionedUsers) {
    await createNotification(workingListMentionedUsers[user], caseNoteId);
  }
};

const createNotification = async (user, caseNoteId) => {
  await models.notification.create({
    user: user.value,
    caseNoteId
  });
};

const deleteNotification = async (user, caseNoteId) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });

  await currentNotification.destroy();
};

const updateNotification = async (user, caseNoteId) => {
  const currentNotification = await models.notification.findOne({
    where: {
      caseNoteId: caseNoteId,
      user: user
    }
  });
  currentNotification.changed("user", true);
  await currentNotification.save();
};
