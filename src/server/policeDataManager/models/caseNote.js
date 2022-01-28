const timezone = require("moment-timezone");
const { TIMEZONE } = require("../../../sharedUtilities/constants");
const globalModels = require("./index");
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";

module.exports = (sequelize, DataTypes) => {
  const CaseNote = sequelize.define(
    "case_note",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false
      },
      actionTakenAt: {
        type: DataTypes.DATE,
        field: "action_taken_at",
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING(255),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("notes", sanitize(value));
          }
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE
      },
      actionId: {
        field: "case_note_action_id",
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: true
    }
  );

  CaseNote.prototype.modelDescription = async function (transaction) {
    const action = await sequelize.query(
      `SELECT name FROM case_note_actions WHERE id=${this.actionId}`
    );
    const formattedActionTakenAt = timezone
      .tz(this.actionTakenAt, TIMEZONE)
      .format("MMM DD, YYYY h:mm:ss A z");

    if (action && action.length && action[0].length && action[0][0].name) {
      return [{ Action: action[0][0].name }];
    } else {
      return [];
    }
  };

  CaseNote.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  CaseNote.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  CaseNote.associate = models => {
    CaseNote.belongsTo(models.cases, {
      foreignKey: { name: "caseId", field: "case_id", allowNull: false }
    });

    CaseNote.belongsTo(models.case_note_action, {
      as: "caseNoteAction",
      foreignKey: {
        name: "caseNoteActionId",
        field: "case_note_action_id",
        allowNull: true
      }
    });
  };

  CaseNote.auditDataChange();
  CaseNote.updateCaseStatusAfterCreate();

  return CaseNote;
};
