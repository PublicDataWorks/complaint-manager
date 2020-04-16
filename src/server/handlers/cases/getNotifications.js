import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");
import sequelize from "sequelize";
import {
  ASCENDING,
  AUDIT_SUBJECT,
  DESCENDING,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import { getUsersFromAuth0 } from "../../common/handlers/users/getUsers";

const getNotifications = asyncMiddleWare(async (request, response, next) => {
  const params = {
    where: {
      updatedAt: { [sequelize.Op.gt]: request.query.timestamp },
      user: request.params.user
    },
    include: [
      {
        model: models.case_note,
        as: "caseNote",
        attributes: [["user", "author"], "case_id"]
      }
    ],
    order: [
      ["has_been_read", ASCENDING],
      ["updated_at", DESCENDING]
    ]
  };

  const rawNotifications = await models.sequelize.transaction(
    async transaction => {
      const allNotifications = await models.notification.findAll(params);
      const auditDetails = getQueryAuditAccessDetails(
        params,
        models.notification.name
      );
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.NOTIFICATIONS,
        auditDetails,
        transaction
      );
      return allNotifications;
    }
  );

  const getAuthorName = async authorEmail => {
    const users = await getUsersFromAuth0();
    const user = users.find(user => user.email === authorEmail);

    return user.name;
  };

  const notifications = await Promise.all(
    rawNotifications.map(async rawNotification => {
      let notification;
      const caseNote = rawNotification.get("caseNote");

      const caseModel = await models.cases.findByPk(caseNote.get("case_id"), {
        attributes: [
          "caseReference",
          "year",
          "caseNumber",
          "primaryComplainant"
        ],
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            attributes: ["isAnonymous", "createdAt"]
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            attributes: [
              "isAnonymous",
              "caseEmployeeType",
              "createdAt",
              "officerId"
            ]
          }
        ],
        paranoid: false
      });

      const caseReference = caseModel.get("caseReference");
      const caseNoteAuthor = caseNote.get("author");
      delete rawNotification["dataValues"]["caseNote"];
      notification = {
        ...rawNotification.dataValues,
        author: {
          name: await getAuthorName(caseNoteAuthor),
          email: caseNoteAuthor
        },
        caseReference: caseReference,
        caseId: caseNote.get("case_id")
      };
      return notification;
    })
  );
  response.send(notifications);
});

module.exports = getNotifications;
