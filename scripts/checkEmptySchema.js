const { exec } = require("child-process-promise");

(async function () {
  const env = process.env.NODE_ENV || "development";
  console.log("Checking for Schema in DB Env:", env);

  const config = require(__dirname +
    "/../src/server/config/sequelize_config.js")[env];

  const schemaQuery =
    "select exists(select * from information_schema.tables where table_schema = 'public' AND table_type LIKE '%TABLE%')::int;";

  const databaseName = config.database;
  const databaseHost = config.host;
  const databaseUser = config.username;
  const databasePassword = config.password;

  console.log("Schema check running...");
  const checkSchemaCommand = `PGPASSWORD=${databasePassword} psql -t -h ${databaseHost} -U ${databaseUser} -d ${databaseName} -c "${schemaQuery}"`;
  exec(checkSchemaCommand)
    .then(result => {
      console.log("*************************");
      const tablesInSchema = parseInt(result.stdout);
      switch (tablesInSchema) {
        case 0:
          console.log("Schema is empty, will load initial schema...");
          break;
        case 1:
          console.log("Schema contains tables, skipping initial schema load.");
          break;
      }
      process.exit(tablesInSchema);
    })
    .catch(err => {
      console.log("*************************");
      console.log("Schema check failed. Error:", err.message);
      process.exit(2);
    });
})();
