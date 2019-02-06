const models = "./";

module.exports = (sequelize, DataTypes) => {
  const ComplainantLetter = sequelize.define(
    "complainant_letter",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    {
      tableName: "complainant_letters"
    }
  );
  ComplainantLetter.associate = function(models) {
    ComplainantLetter.belongsTo(models.civilian, {
      as: "complainantCivilian",
      foreignKey: {
        name: "complainantCivilianId",
        field: "complainant_civilian_id"
      }
    });
    ComplainantLetter.belongsTo(models.case_officer, {
      as: "caseOfficers",
      foreignKey: {
        name: "complainantOfficerId",
        field: "complainant_officer_id"
      }
    });
    ComplainantLetter.belongsTo(models.cases, {
      as: "cases",
      foreignKey: {
        name: "caseId",
        field: "case_id",
        allowNull: false
      }
    });
  };

  ComplainantLetter.prototype.getCaseId = async function(transaction) {
    return this.caseId;
  };

  ComplainantLetter.prototype.modelDescription = async function(transaction) {
    return [];
  };

  ComplainantLetter.auditDataChange();
  return ComplainantLetter;
};
