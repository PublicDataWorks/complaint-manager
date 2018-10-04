const models = "./";

module.exports = (sequelize, DataTypes) => {
  const ReferralLetterOfficerHistoryNotes = sequelize.define(
    "referral_letter_officer_history_note",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      referralLetterOfficerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "referral_letter_officer_id",
        references: {
          model: models.referral_letter_officers,
          key: "id"
        }
      },
      pibCaseNumber: {
        type: DataTypes.STRING,
        field: "pib_case_number"
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
      }
    },
    { tableName: "referral_letter_officer_history_notes" }
  );
  return ReferralLetterOfficerHistoryNotes;
};
