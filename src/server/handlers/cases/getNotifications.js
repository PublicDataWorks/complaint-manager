import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../policeDataManager/models/index");
import sequelize from "sequelize";
import {
  ASCENDING,
  AUDIT_SUBJECT,
  DESCENDING,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";

const auth0UserService = require("../../services/auth0UserService");

const getNotifications = async (date, userEmail) => {
  const params = {
    where: {
      [sequelize.Op.or]: [
        {
          [sequelize.Op.and]: [
            {
              updatedAt: {
                [sequelize.Op.gt]: date
              }
            },
            {
              hasBeenRead: { [sequelize.Op.eq]: true }
            }
          ]
        },
        {
          hasBeenRead: { [sequelize.Op.eq]: false }
        }
      ],
      user: userEmail
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

  const getUsers = async () => {
    try {
      return await auth0UserService.getUsers();
    } catch (error) {
      return [];
    }
  };

  const users = await getUsers();

  const getAuthorName = authorEmail => {
    const user = users.find(user => user.email === authorEmail);

    return user ? user.name : "";
  };

  const rawNotifications = await models.sequelize.transaction(
    async transaction => {
      const allNotifications = await models.notification.findAll(params);
      const auditDetails = getQueryAuditAccessDetails(
        params,
        models.notification.name
      );
      await auditDataAccess(
        userEmail,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.NOTIFICATIONS,
        auditDetails,
        transaction
      );

      return allNotifications;
    }
  );

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
          name: getAuthorName(caseNoteAuthor),
          email: caseNoteAuthor
        },
        caseReference: caseReference,
        caseId: caseNote.get("case_id")
      };
      return notification;
    })
  );
  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        userEmail,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_AUTHOR_DATA_FOR_NOTIFICATIONS,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
    });

  return notifications;
};

const extractNotifications = asyncMiddleware(
  async (request, response, next) => {
    const notifications = await getNotifications(
      request.query.timestamp,
      request.params.user
    );
    response.send(notifications);
  }
);

module.exports = { getNotifications, extractNotifications };
