import asyncMiddleware from "./asyncMiddleware";
import Busboy from "busboy";

const models = require("../policeDataManager/models");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const org = config?.[process.env.NODE_ENV]?.s3Bucket?.split("-")[0];
const processPersonMassUpload = asyncMiddleware(
  async (request, response, next) => {
    if (process.env.NODE_ENV === "development") {
      response.setHeader("Access-Control-Allow-Origin", "https://localhost");
    }

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
      const headers = chunk.toString();
      function getOrgHeadersToValidate(org) {
        if (org === "hcsoc") {
          return [
            "inmateId",
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
            "dateOfBirth",
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
        } else if (org === "noipm") {
          return [
            "firstName",
            "middleName",
            "lastName",
            "rank",
            "race",
            "sex",
            "dob",
            "bureau",
            "district",
            "workStatus",
            "supervisorEmployeeId",
            "hireDate",
            "endDate",
            "employeeType",
            "employeeId"
          ];
        } else {
          return [];
        }
      }
      const expectedHeaders = getOrgHeadersToValidate(org);
      const isValid = expectedHeaders.every(header => headers.includes(header));

      return isValid;
    }
    const errors = [];

    new Promise((resolve, reject) =>
      busboy.on("file", async function (fieldname, file) {
        file.on("data", async data => {
          let countSuccessfulEntries = 0;
          const FIRST_DATA_ROW = 1;
          let lineNumber = 0;
          const allData = data.toString().split("\n");
          const totalNumberOfEntries = allData.length - 1;
          let headers = allData[0].split(",");
          const validated = validateFileHeaders(headers);
          if (validated) {
            for (let i = FIRST_DATA_ROW; i < allData.length; i++) {
              const values = allData[i].split(",");
              const person = {};
              lineNumber = i;

              for (let j = 0; j < values.length; j++) {
                if (
                  headers[j] === "employeeId" ||
                  headers[j] === "supervisorEmployeeId" ||
                  headers[j] === "age"
                ) {
                  person[headers[j].replace("\r", "")] = Number(
                    values[j].trim()
                  );
                } else {
                  person[headers[j].replace("\r", "")] =
                    values[j].length > 0 ? values[j].trim() : null;
                }
              }

              try {
                if (org === "noipm") {
                  if (person.employeeId) {
                    const EMPLOYEE_TYPES = [
                      "Commissioned",
                      "Non-Commissioned",
                      "Recruit",
                      "Civilian"
                    ];

                    if (EMPLOYEE_TYPES.find(e => e === person.employeeType)) {
                      const supervisor = await models.officer.findOne({
                        where: { employeeId: person.supervisorEmployeeId }
                      });

                      if (!supervisor) {
                        person.supervisorEmployeeId = null;
                      }

                      const officer = await models.officer.findOne({
                        where: { employeeId: person.employeeId }
                      });

                      if (officer) {
                        await models.officer.update(person, {
                          where: { employeeId: person.employeeId }
                        });
                      } else {
                        await models.officer.create(person);
                      }

                      countSuccessfulEntries += 1;
                    } else {
                      console.error(
                        `employeeType must be one of the following ${EMPLOYEE_TYPES}.`
                      );
                      errors.push(
                        `Error on line ${lineNumber}: employeeType must be one of the following ${EMPLOYEE_TYPES}.`
                      );
                    }
                  } else {
                    console.error("employeeId is required.");
                    errors.push(
                      `Error on line ${lineNumber}: employeeId is required`
                    );
                  }
                } else if (org === "hcsoc") {
                  if (person.inmateId && person.firstName && person.lastName) {
                    try {
                      const facility = await models.facility.findOne({
                        where: { abbreviation: person.facility }
                      });

                      if (facility) {
                        person.facilityId = facility.id;
                      }

                      if (person.indigent) {
                        person.indigent = person.indigent ? 1 : 0;
                      }

                      if (person.onCount) {
                        person.onCount = person.onCount ? 1 : 0;
                      }

                      const inmate = await models.inmate.findOne({
                        where: { inmateId: person.inmateId }
                      });

                      if (inmate) {
                        await models.inmate.update(person, {
                          where: { inmateId: person.inmateId }
                        });
                      } else {
                        await models.inmate.create(person);
                      }
                      countSuccessfulEntries += 1;
                    } catch (err) {
                      console.error(
                        `error while creating/editing inmate ${err}`
                      );
                    }
                  } else {
                    errors.push(
                      `Error on line ${lineNumber}: inmateId, firstName, and lastName are required.`
                    );
                  }
                }
              } catch (error) {
                console.error(`error creating officer ${error}`);
              }
            }
          } else {
            console.error(`error validating the header`);
            errors.push(
              "Headers Invalid - Please check the headers and upload again."
            );
          }

          console.log(
            `${countSuccessfulEntries} out of ${totalNumberOfEntries} rows were processed successfully`
          );

          if (errors.length > 0) {
            console.error(`Errors: ${errors}`);
          }
        });

        file.on("end", () => {
          console.log(`the end!`);
        });
        resolve(file);
      })
    );

    request.pipe(busboy);
    response.status(200).send({
      message: "items updated",
      errors: []
    });
    request.on("close", () => {});
  }
);

export default processPersonMassUpload;
