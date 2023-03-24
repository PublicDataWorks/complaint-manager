"use strict";
const content =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/content.json`).signatureKeys;

const INSERT_SIGNERS = `INSERT INTO signers (name, signature_file, nickname, title, phone) 
  VALUES `;

const INSERT_LETTER_TYPES = `INSERT INTO letter_types (type, default_sender) 
  VALUES ${
    process.env.ORG === "NOIPM"
      ? `('REFERRAL', {signerId}), ('COMPLAINANT', {signerId})`
      : `('CAN''T HELP', {signerId})`
  }`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = Object.values(content).reduce((acc, elem) => {
      return `${acc} ('${elem.name}', ${`'${elem.signature}'` || "NULL"}, '${
        elem.nickname
      }', '${elem.title}', '${elem.phone}'),`;
    }, INSERT_SIGNERS);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(query, { transaction });
        const signers = await queryInterface.sequelize.query(
          "SELECT id FROM signers",
          { transaction }
        );
        await queryInterface.sequelize.query(
          INSERT_LETTER_TYPES.replaceAll("{signerId}", signers[0][0].id),
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize
        .query("TRUNCATE letter_types CASCADE", { transaction })
        .then(async () => {
          await queryInterface.sequelize.query("TRUNCATE signers CASCADE", {
            transaction
          });
        });
    });
  }
};
