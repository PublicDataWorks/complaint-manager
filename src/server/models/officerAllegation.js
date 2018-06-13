const models = require("./index");

module.exports = (sequelize, DataTypes) => {
  const OfficerAllegation = sequelize.define(
    "officer_allegation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false
      },
      caseOfficerId: {
        type: DataTypes.INTEGER,
        field: "case_officer_id",
        allowNull: false,
        references: {
          model: models.case_officer,
          key: "id"
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at"
      }
    },
    {
      tableName: "officers_allegations",
      paranoid: true
    }
  );

  OfficerAllegation.associate = models => {
    OfficerAllegation.belongsTo(models.allegation, {
      foreignKey: {
        name: "allegationId",
        field: "allegation_id",
        allowNull: false
      }
    });
  };

  return OfficerAllegation;
};
