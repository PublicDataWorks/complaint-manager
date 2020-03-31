import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");
import sequelize from "sequelize";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";

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
        attributes: [["user", "mentioner"], "case_id"],
        include: [
          {
            model: models.cases,
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
            ]
          }
        ]
      }
    ]
  };

  const notifications = await models.sequelize.transaction(
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

  const newNotifications = await Promise.all(
    notifications.map(async notification => {
      let simplifiedNotif;
      const caseNote = notification.get("caseNote");

      const caseModel = await models.cases.findByPk(caseNote.get("case_id"), {
        paranoid: false
      });

      const caseReference = caseModel.get("caseReference");
      delete notification["dataValues"]["caseNote"];
      simplifiedNotif = {
        ...notification.dataValues,
        mentioner: caseNote.get("mentioner"),
        caseReference: caseReference
      };
      return simplifiedNotif;
    })
  );
  response.send(newNotifications);
});

module.exports = getNotifications;
