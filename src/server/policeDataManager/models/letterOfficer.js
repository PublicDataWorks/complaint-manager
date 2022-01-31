const models = require("./index");
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";

module.exports = (sequelize, DataTypes) => {
  const LetterOfficer = sequelize.define(
    "letter_officer",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      caseOfficerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "case_officer_id",
        references: {
          model: models.case_officer,
          key: "id"
        }
      },
      numHistoricalHighAllegations: {
        type: DataTypes.INTEGER,
        field: "num_historical_high_allegations"
      },
      numHistoricalMedAllegations: {
        type: DataTypes.INTEGER,
        field: "num_historical_med_allegations"
      },
      numHistoricalLowAllegations: {
        type: DataTypes.INTEGER,
        field: "num_historical_low_allegations"
      },
      historicalBehaviorNotes: {
        type: DataTypes.TEXT,
        field: "historical_behavior_notes"
      },
      recommendedActionNotes: {
        type: DataTypes.TEXT,
        field: "recommended_action_notes",
        set: function (value) {
          this.setDataValue("recommendedActionNotes", sanitize(value));
        }
      },
      officerHistoryOptionId: {
        type: DataTypes.INTEGER,
        field: "officer_history_option_id",
        references: {
          model: models.officer_history_option,
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at"
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at"
      }
    },
    {
      tableName: "letter_officers",
      paranoid: true,
      hooks: {
        beforeDestroy: async (instance, options) => {
          await instance.sequelize.models.referral_letter_officer_history_note.destroy(
            {
              where: { referralLetterOfficerId: instance.dataValues.id },
              auditUser: options.auditUser,
              transaction: options.transaction
            }
          );
          await instance.sequelize.models.referral_letter_officer_recommended_action.destroy(
            {
              where: { referralLetterOfficerId: instance.dataValues.id },
              auditUser: options.auditUser,
              transaction: options.transaction
            }
          );
        }
      }
    }
  );
  LetterOfficer.associate = function (models) {
    LetterOfficer.hasMany(models.referral_letter_officer_history_note, {
      as: "referralLetterOfficerHistoryNotes",
      foreignKey: {
        name: "referralLetterOfficerId",
        field: "referral_letter_officer_id",
        allowNull: false
      }
    });
    LetterOfficer.belongsTo(models.case_officer, {
      as: "caseOfficer",
      foreignKey: {
        name: "caseOfficerId",
        field: "case_officer_id",
        allowNull: false
      }
    });
    LetterOfficer.hasMany(models.referral_letter_officer_recommended_action, {
      as: "referralLetterOfficerRecommendedActions",
      foreignKey: {
        name: "referralLetterOfficerId",
        field: "referral_letter_officer_id",
        allowNull: false
      }
    });
  };

  LetterOfficer.prototype.getCaseId = async function (transaction) {
    const caseOfficer = await sequelize
      .model("case_officer")
      .findByPk(this.caseOfficerId, { transaction: transaction });
    return caseOfficer.caseId;
  };

  LetterOfficer.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  LetterOfficer.prototype.modelDescription = async function (transaction) {
    const caseOfficer = await sequelize
      .model("case_officer")
      .findByPk(this.caseOfficerId, { transaction: transaction });
    return [{ "Officer Name": caseOfficer.fullName }];
  };

  LetterOfficer.auditDataChange();
  return LetterOfficer;
};
