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
      referralLetterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "referral_letter_id",
        references: {
          model: models.referral_letter,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    { tableName: "referral_letter_officers" }
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
  };
  return ReferralLetterOfficer;
};
