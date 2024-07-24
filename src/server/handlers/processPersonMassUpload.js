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

    let fileReadPromise = new Promise((resolve, reject) =>
      busboy.on("file", async function (fieldname, file) {
        resolve(file);
      })
    );

    request.pipe(busboy);
    const file = await fileReadPromise;

    const s3 = createConfiguredS3Instance();
    managedUpload = await s3.upload({
      Bucket: config[process.env.NODE_ENV].officerBucket,
      Key: `${filename}`,
      Body: file,
      ServerSideEncryption: "AES256",
      ContentType: fileType
    });

    await managedUpload.promise.then(
      data => {
        response.status(200).send({ name: filename });

        auditFileAction(
          request.nickname,
          undefined,
          AUDIT_ACTION.UPLOADED,
          filename,
          AUDIT_FILE_TYPE.SIGNATURE
        );
      },
      error => {
        winston.error(error);
        next(Boom.badImplementation(error));
      }
    );

    request.on("close", () => {
      if (managedUpload) managedUpload.abort();
    });

    // check for org
    // bulkUploadOfficerDataFromS3(filename);
  }
);

export default processPersonMassUpload;
