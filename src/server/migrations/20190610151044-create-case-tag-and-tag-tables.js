"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "tags",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            field: "created_at",
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: "updated_at",
            allowNull: false
          }
        },
        {
          transaction
        }
      );

      await queryInterface.createTable(
        "case_tags",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          createdAt: {
            type: Sequelize.DATE,
            field: "created_at",
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: "updated_at",
            allowNull: false
          },
          caseId: {
            type: Sequelize.INTEGER,
            field: "case_id",
            allowNull: false,
            references: {
              model: "cases",
              key: "id"
            }
          },
          tagId: {
            type: Sequelize.INTEGER,
            field: "tag_id",
            allowNull: false,
            references: {
              model: "tags",
              key: "id"
            }
          }
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable("case_tags", transaction);
      await queryInterface.dropTable("tags", transaction);
    });
  }
};
