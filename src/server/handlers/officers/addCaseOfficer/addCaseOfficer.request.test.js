import request from "supertest";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models/index";
import Case from "../../../../client/testUtilities/case";
import app from "../../../server";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

const config = require("../../../config/config")[process.env.NODE_ENV];

function buildTokenWithPermissions(permissions, nickname) {
  const privateKeyPath = path.join(
    __dirname,
    "../../../",
    "config",
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

describe("POST /cases/:caseId/cases_officers", () => {
  let token;
  beforeAll(() => {
    token = buildTokenWithPermissions("", "TEST_NICKNAME");
  });

  let caseToCreate, officerToCreate, seededCase, seededOfficer;

  beforeEach(async () => {
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    seededOfficer = await models.officer.create(officerToCreate);
    seededCase = await models.cases.create(caseToCreate);
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

  test("should add a known officer to a case", async () => {
    const officerNotes = "some notes";
    const officerRole = "Accused";

    await request(app)
      .post(`/api/cases/${seededCase.id}/cases-officers`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        officerId: seededOfficer.id,
        notes: officerNotes,
        roleOnCase: officerRole
      })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: "Active",
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                id: expect.anything(),
                notes: officerNotes,
                officer: expect.objectContaining({
                  firstName: seededOfficer.firstName,
                  lastName: seededOfficer.lastName
                })
              })
            ])
          })
        );
      });
  });

  test("should add an unknown officer to a case", async () => {
    const officerNotes = "some notes for an unknown officer";
    const officerRole = "Accused";

    await request(app)
      .post(`/api/cases/${seededCase.id}/cases-officers/`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ officerId: null, notes: officerNotes, roleOnCase: officerRole })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                id: expect.anything(),
                notes: officerNotes,
                officer: { fullName: "Unknown Officer" }
              })
            ])
          })
        );
      });
  });
});
