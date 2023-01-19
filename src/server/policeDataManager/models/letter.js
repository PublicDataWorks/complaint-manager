const models = "./";

module.exports = (sequelize, DataTypes) => {
  const Letter = sequelize.define(
    "letter",
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
      typeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "type_id",
        references: {
          model: models.letter_types,
          key: "id"
        }
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
    { tableName: "letters" }
  );

  Letter.prototype.getCaseId = async function (transaction) {
    return this.caseId;
  };

  Letter.prototype.getManagerType = async function (transaction) {
    return "complaint";
  };

  Letter.prototype.modelDescription = async function (transaction) {
    return [];
  };

  Letter.auditDataChange();
  return Letter;
};
