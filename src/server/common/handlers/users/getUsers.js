import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../complaintManager/models";
import {
    AUDIT_SUBJECT,
    MANAGER_TYPE
} from "../../../../sharedUtilities/constants";

const auth0UserService = require("../../../services/auth0UserServices");
const asyncMiddleware = require("../../../handlers/asyncMiddleware");

const getUsers = asyncMiddleware(async (request, response, next) => {
    const transformedUserData = await auth0UserService.getUsers();
    await models.sequelize
        .transaction(async transaction => {
            await auditDataAccess(
                request.nickname,
                null,
                MANAGER_TYPE.COMPLAINT,
                AUDIT_SUBJECT.ALL_USER_DATA,
                {users: {attributes: ["name", "email"]}},
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