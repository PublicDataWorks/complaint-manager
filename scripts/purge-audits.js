/* IMPORTANT!!!!!!!
Do not run this against production.  This was primarily created to remove rows from the 
demo environment, so that the free database could continue to function.
*/

const purgeAudits = async () => {
  const models = require("../src/server/policeDataManager/models/index");
  await models.sequelize.transaction(async transaction => {
    await models.sequelize.query("DELETE FROM data_access_values WHERE id > 0");
    await models.sequelize.query(
      "DELETE FROM data_access_audits  WHERE id > 0"
    );
    await models.sequelize.query("DELETE FROM data_change_audits WHERE id > 0");
    await models.sequelize.query("DELETE FROM audits WHERE id > 0");
  });
};

purgeAudits().catch(error => {
  console.error(error);
  process.exit(1);
});
