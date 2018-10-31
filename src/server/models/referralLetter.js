import {
  SENDER,
  RECIPIENT
} from "../../server/handlers/cases/referralLetters/letterDefaults";

const models = "./";

module.exports = (sequelize, DataTypes) => {
  const ReferralLetter = sequelize.define(
    "referral_letter",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      caseId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "case_id",
        references: {
          model: models.cases,
          key: "id"
        }
      },
      includeRetaliationConcerns: {
        type: DataTypes.BOOLEAN,
        field: "include_retaliation_concerns"
      },
      recipient: {
        type: DataTypes.TEXT,
        defaultValue: RECIPIENT
      },
      sender: {
        type: DataTypes.TEXT,
        defaultValue: SENDER
      },
      transcribedBy: {
        type: DataTypes.STRING,
        field: "transcribed_by"
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
    { tableName: "referral_letters" }
  );
  ReferralLetter.associate = function(models) {
    ReferralLetter.hasMany(models.case_officer, {
      as: "caseOfficers",
      sourceKey: "case_id",
      foreignKey: {
        name: "caseId",
        field: "caseId",
        allowNull: false
      }
    });
    ReferralLetter.hasMany(models.referral_letter_iapro_correction, {
      as: "referralLetterIAProCorrections",
      foreignKey: {
        name: "referralLetterId",
        field: "referral_letter_id",
        allowNull: false
      }
    });
  };
  return ReferralLetter;
};
