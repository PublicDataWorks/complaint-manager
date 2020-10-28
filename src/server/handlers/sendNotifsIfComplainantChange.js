import { sendNotification } from "./cases/getMessageStream";

const models = require("../policeDataManager/models/index");

export const sendNotifsIfComplainantChange = async caseId => {
  const usersWithNotifs = await models.notification.findAll({
    include: [
      {
        model: models.case_note,
        as: "caseNote",
        where: { caseId: caseId },
        attributes: ["case_id"]
      }
    ],
    attributes: ["user"]
  });

  let previousUsers = [];

  for (const user in usersWithNotifs) {
    const userWithNotif = usersWithNotifs[user].user;
    if (!previousUsers.includes(userWithNotif)) {
      await sendNotification(userWithNotif);
      previousUsers.push(userWithNotif);
    }
  }
};
