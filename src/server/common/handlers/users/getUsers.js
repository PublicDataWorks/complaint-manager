import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  FAKE_USERS
} from "../../../../sharedUtilities/constants";
import { isAuthDisabled } from "../../../isAuthDisabled";

const auth0UserService = require("../../../services/auth0UserService");
const asyncMiddleware = require("../../../handlers/asyncMiddleware");

const getUsers = asyncMiddleware(async (request, response, next) => {
  const transformedUserData = isAuthDisabled()
    ? FAKE_USERS
    : await auth0UserService.getUsers();

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

  response.send(200, transformedUserData);
});

export default getUsers;
