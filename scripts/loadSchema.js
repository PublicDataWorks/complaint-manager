const { exec } = require("child-process-promise");

(async function () {
  const env = process.env.NODE_ENV || "development";
  console.log("Loading Schema in DB Env:", env);

  const config = require(__dirname +
    "/../src/server/config/sequelize_config.js")[env];

  const schemaFile = `20220426_schema.sql`;

  const databaseName = config.database;
  const databaseHost = config.host;
  const databaseUser = config.username;
  const databasePassword = config.password;

  console.log("Schema import running...");
  const loadSchemaCommand = `PGPASSWORD=${databasePassword} psql -a -U ${databaseUser} -h ${databaseHost} -d ${databaseName} < ./src/server/migrations/schema/${schemaFile}`;
  exec(loadSchemaCommand)
    .then(() => {
      console.log("*************************");
      console.log("Schema import successful");
      process.exit(0);
    })
    .catch(err => {
      console.log("*************************");
      console.log("Schema import failed. Error:", err.message);
      process.exit(1);
    });
})();
