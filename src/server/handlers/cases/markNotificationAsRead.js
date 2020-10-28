import { sendNotification } from "./getMessageStream";

const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../policeDataManager/models/index");

const markNotificationAsRead = asyncMiddleWare(
  async (request, response, next) => {
    const notificationId = request.params.notificationId;

    await models.notification.update(
      { hasBeenRead: true },
      {
        where: { id: notificationId },
        auditUser: request.nickname,
        silent: true
      }
    );

    await sendNotification(request.nickname);

    response.status(200).send();
  }
);

export default markNotificationAsRead;
