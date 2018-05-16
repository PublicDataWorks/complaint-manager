import app from "../../server";
import fs from "fs";
import path from "path";
import models from "../../models/index";
import jwt from "jsonwebtoken";
import moment from "moment/moment";
import Case from "../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import Officer from "../../../client/testUtilities/Officer";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";

const config = require("../../config/config")[process.env.NODE_ENV];

function buildTokenWithPermissions(permissions, nickname) {
  const privateKeyPath = path.join(
    __dirname,
    "../../config",
    "test",
    "private.pem"
  );
  const cert = fs.readFileSync(privateKeyPath);

  const payload = {
    foo: "bar",
    scope: `${config.authentication.scope} ${permissions}`
  };
  payload[`${config.authentication.nicknameKey}`] = nickname;

  const options = {
    audience: config.authentication.audience,
    issuer: config.authentication.issuer,
    algorithm: config.authentication.algorithm
  };

  return jwt.sign(payload, cert, options);
}

describe("getCases", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.audit_log.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
  });

  describe("GET /cases", () => {
    let seededCase, officer;

    beforeEach(async () => {
      const civilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withNoAddress()
        .withFirstName("Robert")
        .build();

      officer = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Jeff")
        .withId(undefined)
        .build();

      const accusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withCaseId(undefined)
        .withId(undefined)
        .withOfficer(officer)
        .build();

      const defaultCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withCivilians([civilian])
        .withAttachments(undefined)
        .withIncidentLocation(undefined)
        .withAccusedOfficers([accusedOfficer])
        .build();

      seededCase = await models.cases.create(defaultCase, {
        include: [
          {
            model: models.civilian
          },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [models.officer]
          }
        ]
      });
    });

    test("should get all cases", async () => {
      await request(app)
        .get("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body.cases).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                civilians: expect.arrayContaining([
                  expect.objectContaining({
                    firstName: seededCase.civilians[0].firstName,
                    lastName: seededCase.civilians[0].lastName,
                    phoneNumber: seededCase.civilians[0].phoneNumber,
                    email: seededCase.civilians[0].email
                  })
                ]),
                accusedOfficers: expect.arrayContaining([
                  expect.objectContaining({
                    officer: expect.objectContaining({
                      firstName: officer.firstName
                    })
                  })
                ]),
                complainantType: seededCase.complainantType,
                createdAt: seededCase.createdAt.toISOString(),
                firstContactDate: moment(seededCase.firstContactDate).format(
                  "YYYY-MM-DD"
                ),
                status: "Initial",
                createdBy: "tuser",
                assignedTo: "tuser"
              })
            ])
          );
        });
    });
  });
});
