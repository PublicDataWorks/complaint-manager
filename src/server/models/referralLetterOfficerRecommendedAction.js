import models from "./index";

module.exports = (sequelize, DataTypes) => {
  const ReferralLetterOfficerRecommendedAction = sequelize.define(
    "referral_letter_officer_recommended_action",
    {
      referralLetterOfficerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "referral_letter_officer_id",
        references: {
          model: models.case_officer,
          key: "id"
        }
      },
      recommendedActionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "recommended_action_id",
        references: {
          model: models.recommended_action,
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
      tableName: "referral_letter_officer_recommended_actions",
      paranoid: true
    }
  );
  ReferralLetterOfficerRecommendedAction.associate = function(models) {
    ReferralLetterOfficerRecommendedAction.belongsTo(
      models.recommended_action,
      {
        as: "recommendedAction",
        foreignKey: {
          name: "recommendedActionId",
          field: "recommended_action_id",
          allowNull: false
        }
      }
    );
  };
  return ReferralLetterOfficerRecommendedAction;
};
