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
        type: DataTypes.TEXT
      },
      recipientAddress: {
        type: DataTypes.TEXT,
        field: "recipient_address"
      },
      sender: {
        type: DataTypes.TEXT
      },
      transcribedBy: {
        type: DataTypes.STRING,
        field: "transcribed_by"
      },
      editedLetterHtml: {
        type: DataTypes.TEXT,
        field: "edited_letter_html"
      },
      finalPdfFilename: {
        type: DataTypes.STRING,
        field: "final_pdf_filename"
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
  ReferralLetter.associate = function (models) {
    ReferralLetter.hasMany(models.case_officer, {
      as: "caseOfficers",
      sourceKey: "caseId",
      foreignKey: {
        name: "caseId",
        field: "caseId",
        allowNull: false
      }
    });
  };

  ReferralLetter.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  ReferralLetter.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  ReferralLetter.prototype.modelDescription = async function (transaction) {
    return [];
  };

  ReferralLetter.auditDataChange();
  return ReferralLetter;
};
