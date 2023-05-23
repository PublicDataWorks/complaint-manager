const updateOfficerDataFromS3 = require("../src/server/seeder_jobs/createSeedOfficerDataFromS3");

if (process.env.NODE_ENV === "production" && !process.argv[1]) {
  console.log(
    "You must provide a file name from S3 when loading in production."
  );
  process.exit(1);
}

updateOfficerDataFromS3(process.argv[1], true);
