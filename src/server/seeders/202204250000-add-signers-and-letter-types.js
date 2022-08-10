"use strict";
const content =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/content.json`).signatureKeys;

const INSERT_SIGNERS = `INSERT INTO signers (name, signature_file, nickname, title, phone) 
  VALUES `;

const INSERT_LETTER_TYPES = `INSERT INTO letter_types (type, default_sender) 
  VALUES ('REFERRAL', 1), 
    ('COMPLAINANT', 1)`;

module.exports = {
  up: async queryInterface => {
    let query = Object.values(content).reduce((acc, elem) => {
      return `${acc} ('${elem.name}', '${elem.signature}', '${elem.nickname}', '${elem.title}', '${elem.phone}'),`;
    }, INSERT_SIGNERS);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(query, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(INSERT_LETTER_TYPES, {
              transaction
            });
          });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
      );
    }
  },

  down: async queryInterface => {
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
