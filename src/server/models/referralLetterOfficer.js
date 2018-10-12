const models = require("./");

module.exports = (sequelize, DataTypes) => {
  const ReferralLetterOfficer = sequelize.define(
    "referral_letter_officer",
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
        field: "recommended_action_notes"
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
      tableName: "referral_letter_officers",
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
        }
      }
    }
  );
  ReferralLetterOfficer.associate = function(models) {
    ReferralLetterOfficer.hasMany(models.referral_letter_officer_history_note, {
      as: "referralLetterOfficerHistoryNotes",
      foreignKey: {
        name: "referralLetterOfficerId",
        field: "referral_letter_officer_id",
        allowNull: false
      }
    });
    ReferralLetterOfficer.belongsTo(models.case_officer, {
      as: "caseOfficer",
      foreignKey: {
        name: "caseOfficerId",
        field: "case_officer_id",
        allowNull: false
      }
    });
    ReferralLetterOfficer.hasMany(
      models.referral_letter_officer_recommended_action,
      {
        as: "referralLetterOfficerRecommendedActions",
        foreignKey: {
          name: "referralLetterOfficerId",
          field: "referral_letter_officer_id",
          allowNull: false
        }
      }
    );
  };
  return ReferralLetterOfficer;
};
