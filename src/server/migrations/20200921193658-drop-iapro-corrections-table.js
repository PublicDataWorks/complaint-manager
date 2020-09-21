'use strict';

const AFFECTED_TABLE = 'referral_letter_iapro_corrections';

const up = async (queryInterface, Sequelize) => await queryInterface.dropTable(AFFECTED_TABLE);

const down = async (queryInterface, Sequelize) => await queryInterface.createTable(
  AFFECTED_TABLE,
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    referralLetterId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    details: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE
    }
  });

export default { up, down };
