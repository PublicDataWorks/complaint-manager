module.exports = (sequelize, DataTypes) => {
    const LetterType = sequelize.define("letter_type", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false
      }
    });
    LetterType.associate = models => {
        LetterType.belongsTo(models.signers, {
            as: "defaultSender",
            foreignKey: { field: "default_sender", allowNull: false }
        });
    };
    return LetterType;
  };
  