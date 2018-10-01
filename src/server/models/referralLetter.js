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
        references: {
          model: models.cases,
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
      }
    },
    { tableName: "referral_letters" }
  );
  ReferralLetter.associate = function(models) {
    ReferralLetter.hasMany(models.referral_letter_officer, {
      as: "referralLetterOfficers",
      foreignKey: {
        name: "referralLetterId",
        field: "referral_letter_id",
        allowNull: false
      }
    });
  };
  return ReferralLetter;
};
