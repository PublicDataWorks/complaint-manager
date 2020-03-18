const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");
import sequelize from "sequelize";

const getNotifications = asyncMiddleWare(async (request, response, next) => {
  const params = {
    where: {
      updatedAt: { [sequelize.Op.gt]: request.query.timestamp },
      user: request.params.user
    }
  };

  const notifications = await models.sequelize.transaction(
    async transaction => {
      const allNotifications = await models.notification.findAll(params);
      return allNotifications;
    }
  );
  response.send(notifications);
});

module.exports = getNotifications;
