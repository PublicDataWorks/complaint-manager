import app from "../../server";
import models from "../../models/index";
import moment from "moment/moment";
import Case from "../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import Officer from "../../../client/testUtilities/Officer";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import buildTokenWithPermissions from "../../requestTestHelpers";

const config = require("../../config/config")[process.env.NODE_ENV];

describe("getCases", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.data_change_audit.truncate();
  });

  afterEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.data_change_audit.truncate();
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
        .withComplainantCivilians([civilian])
        .withAttachments(undefined)
        .withIncidentLocation(undefined)
        .withAccusedOfficers([accusedOfficer])
        .build();

      seededCase = await models.cases.create(defaultCase, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians"
          },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [models.officer]
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            include: [models.officer]
          }
        ],
        auditUser: "someone"
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
                complainantCivilians: expect.arrayContaining([
                  expect.objectContaining({
                    firstName: seededCase.complainantCivilians[0].firstName,
                    lastName: seededCase.complainantCivilians[0].lastName,
                    phoneNumber: seededCase.complainantCivilians[0].phoneNumber,
                    email: seededCase.complainantCivilians[0].email
                  })
                ]),
                accusedOfficers: expect.arrayContaining([
                  expect.objectContaining({
                    officer: expect.objectContaining({
                      firstName: officer.firstName
                    })
                  })
                ]),
                complainantOfficers: expect.arrayContaining([
                  expect.objectContaining({
                    officer: expect.objectContaining({
                      fullName:
                        seededCase.complainantOfficers[0].officer.fullName
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
