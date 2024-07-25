import asyncMiddleware from "./asyncMiddleware";
import bulkUploadOfficerDataFromS3 from "../seeder_jobs/bulkUploadOfficerDataFromS3";
import Busboy from "busboy";
import Boom from "boom";
import winston from "winston";
import { AUDIT_ACTION, AUDIT_FILE_TYPE } from "../../sharedUtilities/constants";
import createConfiguredS3Instance from "../createConfiguredS3Instance";
import { auditFileAction } from "./audits/auditFileAction";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const processPersonMassUpload = asyncMiddleware(
  async (request, response, next) => {
    if (process.env.NODE_ENV === "development") {
      response.setHeader("Access-Control-Allow-Origin", "https://localhost");
    }

    let managedUpload;
    const busboy = Busboy({
      headers: request.headers
    });

    let filename, fileType;

    busboy.on("field", function (fieldname, value) {
      if (fieldname === "name") {
        filename = value;
      } else if (fieldname == "type") {
        fileType = value;
      }
    });

    function validateFileHeaders(chunk) {
      const org = process.env.ORG;
      const headers = chunk.toString();
      const expectedHawaiiHeaders = [
        "inmateID",
        "firstName",
        "lastName",
        "region",
        "facility",
        "locationSub1",
        "locationSub2",
        "locationSub3",
        "locationSub4",
        "housing",
        "currentLocation",
        "status",
        "custodyStatus",
        "custodyStatusReason",
        "securityClassification",
        "gender",
        "primaryEthnicity",
        "race",
        "muster",
        "indigent",
        "releaseType",
        "classificationDate",
        "bookingStartDate",
        "tentativeReleaseDate",
        "bookingEndDate",
        "actualReleaseDate",
        "weekender",
        "DOB",
        "age",
        "countryOfBirth",
        "citizenship",
        "religion",
        "language",
        "dateDeathRecorded",
        "sentenceLength",
        "onCount",
        "transferDate",
        "address"
      ];
      const expectedNOIPMHeaders = [
        "firstName",
        "middleName",
        "lastName",
        "rank",
        "race",
        "sex",
        "DOB",
        "bureau",
        "district",
        "workStatus",
        "supervisorEmployeeID",
        "hireDate",
        "endDate",
        "employeeType",
        "employeeID"
      ];
      function checkCurrentOrg(org, hawaiiHeaders, noipmHeaders) {
        if (org === "HAWAII") {
          return hawaiiHeaders;
        } else if (org === "NOIPM") {
          return noipmHeaders;
        } else {
          return [];
        }
      }
      const expectedHeaders = checkCurrentOrg(org, expectedHawaiiHeaders, expectedNOIPMHeaders);
      const isValid = expectedHeaders.every(header => headers.includes(header));
      return isValid;
    }
    let fileReadPromise = new Promise((resolve, reject) =>
      busboy.on("file", async function (fieldname, file) {
        let validated = false;
        file.on("data", (data) => {
          if (!validated) {
            let headers = data.toString().split("\n")[0].split(",");
            validateFileHeaders(headers);
            validated = validateFileHeaders(headers);;
            console.log("validated", validated);
          }
        });

        file.on("end", () => {
          if (validated) {
            resolve(file);
          } else {
            file.destroy();
            reject("Invalid file format");
          }
        });
      })
    );

    request.pipe(busboy);
    try {
      const file = await fileReadPromise;
      const s3 = createConfiguredS3Instance();
      managedUpload = await s3.upload({
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${filename}`,
        Body: file,
        ServerSideEncryption: "AES256",
        ContentType: fileType
      }).promise();
      if (managedUpload) {
        return response.status(200).send("File uploaded successfully");
      }

    } catch (error) {
      console.log(error);      
      return next(Boom.badRequest("Invalid headers"));
    }

    request.on("close", () => {
      if (managedUpload) managedUpload.abort();
    });

    // check for org
    //bulkUploadOfficerDataFromS3(filename);
  }
);

export default processPersonMassUpload;
