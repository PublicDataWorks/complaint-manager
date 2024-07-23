import asyncMiddleware from "./asyncMiddleware";
import bulkUploadOfficerDataFromS3 from "../seeder_jobs/bulkUploadOfficerDataFromS3";

const processPersonMassUpload = asyncMiddleware(
  async (request, response, next) => {
    response.status(200).send("GOTCHA");
    bulkUploadOfficerDataFromS3();
  }
);

export default processPersonMassUpload;
