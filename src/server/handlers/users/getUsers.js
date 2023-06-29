import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";

const { userService } = require("../../../auth");
const asyncMiddleware = require("../asyncMiddleware");

const getUsers = asyncMiddleware(async (request, response, next) => {
  const transformedUserData = await userService.getUsers();

  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_USER_DATA,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
    });

  response.status(200).send(transformedUserData);
});

export default getUsers;
