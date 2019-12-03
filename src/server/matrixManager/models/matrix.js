import { MANAGER_TYPE } from "../../../sharedUtilities/constants";

export default (sequelize, DataTypes) => {
  const Matrix = sequelize.define("matrices", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pibControlNumber: {
      field: "pib_control_number",
      type: DataTypes.STRING,
      allowNull: false
    },
    firstReviewer: {
      field: "first_reviewer",
      type: DataTypes.STRING,
      allowNull: false
    },
    secondReviewer: {
      field: "second_reviewer",
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE
    },
    deletedAt: {
      field: "deleted_at",
      type: DataTypes.DATE,
      as: "deletedAt"
    }
  });

  Matrix.prototype.modelDescription = async function(transaction) {
    return [{ "PIB Number": this.pibControlNumber }];
  };

  Matrix.prototype.getMatrixId = async function(transaction) {
    return this.id;
  };

  Matrix.prototype.getManagerType = async function(transaction) {
    return MANAGER_TYPE.MATRIX;
  };

  Matrix.associate = models => {
    Matrix.hasMany(models.audit, {
      foreignKey: { name: "referenceId", field: "reference_id" },
      scope: {
        managerType: MANAGER_TYPE.MATRIX
      }
    });
  };

  Matrix.auditDataChange();

  return Matrix;
};
