const models = require("./index");
const { ALLEGATION_SEVERITY } = require("../../../sharedUtilities/constants");
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";


module.exports = (sequelize, DataTypes) => {
  const OfficerAllegation = sequelize.define(
    "officer_allegation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
        set: function (value) {
          if (value !== null) {
            this.setDataValue("details", sanitize(value));
          }
        }
      },
      caseOfficerId: {
        type: DataTypes.INTEGER,
        field: "case_officer_id",
        allowNull: false,
        references: {
          model: models.case_officer,
          key: "id"
        }
      },
      severity: {
        type: DataTypes.ENUM(ALLEGATION_SEVERITY.ALL),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at"
      }
    },
    {
      tableName: "officers_allegations",
      paranoid: true
    }
  );

  OfficerAllegation.prototype.getCaseId = async function (transaction) {
    const caseOfficer = await sequelize
      .model("case_officer")
      .findByPk(this.caseOfficerId, {
        transaction: transaction
      });

    return caseOfficer.caseId;
  };

  OfficerAllegation.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  OfficerAllegation.prototype.modelDescription = async function (transaction) {
    const caseOfficer = await sequelize
      .model("case_officer")
      .findByPk(this.caseOfficerId, {
        transaction: transaction
      });

    const allegation = await sequelize
      .model("allegation")
      .findByPk(this.allegationId, {
        transaction: transaction
      });

    const fullName = caseOfficer.fullName;
    const rule = allegation.rule;
    const paragraph = allegation.paragraph;
    const directive = allegation.directive;

    return [
      {
        "Officer Name": fullName
      },
      { Rule: rule },
      { Paragraph: paragraph },
      {
        Directive: directive
      }
    ];
  };

  OfficerAllegation.associate = models => {
    OfficerAllegation.belongsTo(models.allegation, {
      foreignKey: {
        name: "allegationId",
        field: "allegation_id",
        allowNull: false
      }
    });
    OfficerAllegation.belongsTo(models.case_officer, {
      as: "caseOfficer"
    });
  };

  //TODO: when comment this out, no tests fail!
  OfficerAllegation.auditDataChange();

  return OfficerAllegation;
};
