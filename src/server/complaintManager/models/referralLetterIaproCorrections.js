"use strict";
const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  const ReferralLetterIaproCorrection = sequelize.define(
    "referral_letter_iapro_correction",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      referralLetterId: {
        field: "referral_letter_id",
        type: DataTypes.INTEGER,
        references: {
          model: models.referral_letter,
          key: "id"
        }
      },
      details: {
        type: DataTypes.TEXT
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
      tableName: "referral_letter_iapro_corrections",
      paranoid: true
    }
  );

  ReferralLetterIaproCorrection.prototype.getCaseId = async function(
    transaction
  ) {
    const referralLetter = await sequelize
      .model("referral_letter")
      .findByPk(this.referralLetterId, { transaction });
    return referralLetter.caseId;
  };

  ReferralLetterIaproCorrection.prototype.modelDescription = async function(
    transaction
  ) {
    return [];
  };

  ReferralLetterIaproCorrection.auditDataChange();
  return ReferralLetterIaproCorrection;
};
