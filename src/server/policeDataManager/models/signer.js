module.exports = (sequelize, DataTypes) => {
  const Signer = sequelize.define("signers", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    signatureFile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "signature_file"
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
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

  Signer.prototype.toPayload = instance => ({
    id: instance.id,
    name: instance.name,
    nickname: instance.nickname,
    title: instance.title,
    phone: instance.phone,
    links: [
      {
        rel: "signature",
        href: `/api/signers/${instance.id}/signature`
      }
    ]
  });

  return Signer;
};
