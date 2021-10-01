import app from "./server";
import request from "supertest";
import models from "./policeDataManager/models";
import Civilian from "../sharedTestHelpers/civilian";
import Case from "../sharedTestHelpers/case";
import Attachment from "../sharedTestHelpers/attachment";
import { civilianWithAddress } from "./testHelpers/ObjectMothers";
import Address from "../sharedTestHelpers/Address";
import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  NICKNAME
} from "../sharedUtilities/constants";
import AWS from "aws-sdk";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse,
  suppressWinstonLogs
} from "./testHelpers/requestTestHelpers";
import audit from "./handlers/audits/auditAuthentication";
import createCaseTag from "./handlers/cases/createCaseTag";
import { createTestCaseWithoutCivilian } from "./testHelpers/modelMothers";
import getTags from "./handlers/tags/getTags";
import { authEnabledTest } from "./testHelpers/authEnabledTest";
import { isAuthDisabled } from "./isAuthDisabled";
const {
  CITY
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

jest.mock("auth0", () => ({
  AuthenticationClient: jest.fn()
}));

jest.mock("aws-sdk", () => ({
  S3: jest.fn()
}));

jest.mock("./handlers/audits/auditAuthentication", () =>
  jest.fn((request, response, next) => {
    response.send();
  })
);
jest.mock("./handlers/cases/createCaseTag", () =>
  jest.fn((request, response, next) => {
    response.send();
  })
);
jest.mock("./handlers/tags/getTags", () =>
  jest.fn((request, response, next) => {
    response.send();
  })
);

describe("server", () => {
  let token, user, raceEthnicity;

  beforeEach(async () => {
    user = NICKNAME;
    token = buildTokenWithPermissions("", NICKNAME);

    const raceEthnicityAttributes = {
      name: "Samoan",
      id: undefined
    };
    raceEthnicity = await models.race_ethnicity.create(
      raceEthnicityAttributes,
      {
        auditUser: "test"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("GET /health-check", () => {
    test("should show healthy if db connection works", async () => {
      const responsePromise = request(app).get("/health-check");

      await expectResponse(responsePromise, 200);
    });
  });

  describe("token check", () => {
    authEnabledTest(() => {
      test(
        "should return 401 with invalid token",
        suppressWinstonLogs(async () => {
          const responsePromise = request(app)
            .get("/api/cases")
            .set("Content-Header", "application/json")
            .set("Authorization", `Bearer INVALID_KEY`);

          await expectResponse(responsePromise, 401, {
            error: "Unauthorized",
            message: "Invalid token",
            statusCode: 401
          });
        })
      );

      test(
        "should return 401 without authorization header",
        suppressWinstonLogs(async () => {
          const responsePromise = request(app)
            .get("/api/cases")
            .set("Content-Header", "application/json");

          await expectResponse(responsePromise, 401, {
            error: "Unauthorized",
            message: "Invalid token",
            statusCode: 401
          });
        })
      );

      test(
        "should return 401 when nickname missing",
        suppressWinstonLogs(async () => {
          token = buildTokenWithPermissions();

          const responsePromise = request(app)
            .post("/api/cases")
            .set("Content-Header", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({});

          await expectResponse(responsePromise, 401, {
            error: "Unauthorized",
            message: "User nickname missing",
            statusCode: 401
          });
        })
      );
    });
  });

  describe("POST /audit", () => {
    const mockLog = AUDIT_ACTION.LOGGED_OUT;
    test("should audit log out", async () => {
      await request(app)
        .post("/api/audit")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ log: mockLog });

      expect(audit).toHaveBeenCalled();
    });
  });

  describe("POST /cases/:caseId/case-tags", () => {
    test("should create case tag", async () => {
      const createdCase = await createTestCaseWithoutCivilian();

      await request(app)
        .post(`/api/cases/${createdCase.id}/case-tags`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagId: 1, tagName: undefined });

      expect(createCaseTag).toHaveBeenCalled();
    });
  });

  describe("GET /tags", () => {
    test("should get existing tags", async () => {
      await request(app)
        .get(`/api/tags`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(getTags).toHaveBeenCalled();
    });
  });

  describe("POST and PUT /cases", () => {
    let requestBody, responseBody;

    beforeEach(() => {
      //TODO Restructure this to have the same structure as represented in Redux/Builder.
      requestBody = {
        civilian: {
          firstName: "Manny",
          lastName: "Rodriguez",
          phoneNumber: "8201387432",
          email: "mrod@gmail.com"
        },
        case: {
          firstContactDate: "2018-01-31",
          incidentDate: "2018-03-16",
          complaintType: CIVILIAN_INITIATED
        }
      };
    });

    test("should create and edit a case", async () => {
      const caseRequest = request(app);

      const caseResponsePromise = caseRequest
        .post("/api/cases")
        .set("Content-Header", "application/json")
        .send(requestBody);

      if (!isAuthDisabled()) {
        caseResponsePromise.set("Authorization", `Bearer ${token}`);
      }

      const caseResponse = await expectResponse(
        caseResponsePromise,
        201,
        expect.objectContaining({
          ...requestBody.case,
          createdBy: user,
          assignedTo: user,
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining(requestBody.civilian)
          ])
        })
      );

      const createdCaseId = caseResponse.body.id;

      const editBody = {
        firstContactDate: "2018-04-27",
        incidentTime: "16:00:00",
        incidentDate: "2018-03-18",
        incidentLocation: new Address.Builder()
          .defaultAddress()
          .withId(undefined)
          .withAddressableId(undefined)
          .withAddressableType(ADDRESSABLE_TYPE.CASES)
          .withStreetAddress("123 fleet street")
          .build()
      };

      const responsePromise = caseRequest
        .put(`/api/cases/${createdCaseId}`)
        .set("Content-Header", "application/json")
        .send(editBody);

      if (!isAuthDisabled()) {
        responsePromise.set("Authorization", `Bearer ${token}`);
      }

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          id: createdCaseId,
          ...editBody,
          incidentLocation: expect.objectContaining({
            streetAddress: "123 fleet street",
            addressableId: createdCaseId,
            addressableType: ADDRESSABLE_TYPE.CASES
          }),
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining(requestBody.civilian)
          ])
        })
      );
    });
  });

  describe("POST /civilian", () => {
    let existingCase, existingCivilian;

    beforeEach(async () => {
      const existingCivilianToCreate = new Civilian.Builder()
        .defaultCivilian()
        .withNoAddress()
        .withId(undefined)
        .withCaseId(undefined)
        .withFirstName("Existing Civilian")
        .build();

      const caseToCreate = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplainantCivilians([existingCivilianToCreate]);

      existingCase = await models.cases.create(caseToCreate, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user"
          }
        ],
        auditUser: "someone"
      });

      existingCivilian = existingCase.complainantCivilians[0];
      const existingCivilianAddress = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableId(existingCivilian.id)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withCity("post city")
        .build();
      await existingCivilian.createAddress(existingCivilianAddress, {
        auditUser: "someone"
      });
    });

    test("should create a civilian and add it to a case", async () => {
      const newCivilianAddress = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withNoAddressable()
        .withCity("post city");

      const newCivilian = new Civilian.Builder()
        .defaultCivilian()
        .withAddress(newCivilianAddress)
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withFirstName("New Civilian")
        .withRaceEthnicityId(raceEthnicity.id);

      const responsePromise = request(app)
        .post(`/api/cases/${existingCase.id}/civilians`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(newCivilian);

      await expectResponse(
        responsePromise,
        201,
        expect.objectContaining({
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({
              firstName: existingCivilian.firstName,
              caseId: existingCase.id,
              address: expect.objectContaining({
                city: "post city"
              })
            }),
            expect.objectContaining({
              firstName: newCivilian.firstName,
              caseId: existingCase.id,
              address: expect.objectContaining({
                city: "post city",
                addressableType: ADDRESSABLE_TYPE.CIVILIAN
              })
            })
          ])
        })
      );
    });
  });

  describe("PUT /civilian/:id", () => {
    let seededCivilian, seededCase;
    beforeEach(async () => {
      const civilianDefault = new Civilian.Builder()
        .defaultCivilian()
        .withNoAddress()
        .withId(undefined)
        .build();
      const caseDefault = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withComplainantCivilians([civilianDefault])
        .withIncidentLocation(undefined)
        .build();

      seededCase = await models.cases.create(caseDefault, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user"
          }
        ],
        auditUser: "someone"
      });

      seededCivilian = seededCase.complainantCivilians[0];
      const address = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableId(seededCivilian.id)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .build();
      await seededCivilian.createAddress(address, { auditUser: "someone" });
    });

    test("should update an existing civilian", async () => {
      const updatedCivilian = {
        firstName: "BOBBY",
        lastName: "FISHHERRR"
      };
      const responsePromise = request(app)
        .put(`/api/cases/${seededCase.id}/civilians/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian);

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({
              firstName: updatedCivilian.firstName,
              lastName: updatedCivilian.lastName
            })
          ])
        })
      );
    });

    test("should save new address if it doesnt exist yet", async () => {
      const updatedCivilian = {
        id: seededCivilian.id,
        address: {
          state: "IL"
        }
      };

      const responsePromise = request(app)
        .put(`/api/cases/${seededCase.id}/civilians/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian);

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({
              address: expect.objectContaining({
                state: updatedCivilian.address.state,
                addressableType: ADDRESSABLE_TYPE.CIVILIAN
              })
            })
          ])
        })
      );
    });

    test("should update address if it exists", async () => {
      const caseDefault = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplainantCivilians([civilianWithAddress])
        .build();

      const caseToUpdate = await models.cases.create(caseDefault, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user"
          }
        ],
        auditUser: "someone"
      });

      let civilianToUpdate = caseToUpdate.dataValues.complainantCivilians[0];
      const address = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withAddressableId(civilianToUpdate.id)
        .build();

      await civilianToUpdate.createAddress(address, { auditUser: "someone" });
      await civilianToUpdate.reload({ include: [models.address] });

      const responsePromise = request(app)
        .put(
          `/api/cases/${civilianToUpdate.caseId}/civilians/${civilianToUpdate.id}`
        )
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: civilianToUpdate.id,
          address: {
            id: civilianToUpdate.address.id,
            city: CITY
          }
        });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({
              address: expect.objectContaining({
                city: CITY
              })
            })
          ])
        })
      );
    });

    test("should allow blank address", async () => {
      const caseDefault = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .withComplainantCivilians([civilianWithAddress])
        .build();

      const caseToUpdate = await models.cases.create(caseDefault, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user",
            include: [
              {
                model: models.address,
                auditUser: "test user"
              }
            ]
          }
        ],
        auditUser: "someone"
      });

      let civilianToUpdate = caseToUpdate.dataValues.complainantCivilians[0];

      const responsePromise = request(app)
        .put(`/api/cases/${caseToUpdate.id}/civilians/${civilianToUpdate.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: civilianToUpdate.id,
          address: {
            id: civilianToUpdate.address.id,
            streetAddress: "",
            streetAddress2: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
          }
        });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({
              address: expect.objectContaining({
                streetAddress: "",
                streetAddress2: "",
                city: "",
                state: "",
                country: "",
                zipCode: ""
              })
            })
          ])
        })
      );
    });

    test("should update the case status to active when an associated civilian has been updated ", async () => {
      const updatedCivilian = {
        firstName: "BOBBY"
      };
      const responsePromise = request(app)
        .put(`/api/cases/${seededCase.id}/civilians/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian);

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({ status: CASE_STATUS.ACTIVE })
      );
    });
  });

  describe("GET /cases/:id/case-notes", () => {
    let createdCase, caseNoteAction;
    beforeEach(async () => {
      caseNoteAction = await models.case_note_action.create(
        { name: "Some Action" },
        { auditUser: "Some User" }
      );
      const existingCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .build();
      createdCase = await models.cases.create(existingCase, {
        auditUser: "someone"
      });

      await models.case_note.create(
        {
          caseId: createdCase.id,
          caseNoteActionId: caseNoteAction.id,
          user: "tuser",
          actionTakenAt: new Date().toISOString(),
          notes: "some notes"
        },
        { auditUser: "someone" }
      );
    });

    test("should display case notes for an existing case", async () => {
      const responsePromise = request(app)
        .get(`/api/cases/${createdCase.dataValues.id}/case-notes`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(
        responsePromise,
        200,
        expect.arrayContaining([
          expect.objectContaining({
            caseId: createdCase.id,
            caseNoteActionId: caseNoteAction.id,
            caseNoteAction: expect.objectContaining({
              id: caseNoteAction.id,
              name: caseNoteAction.name
            }),
            author: { email: "tuser", name: "" },
            notes: "some notes"
          })
        ])
      );
    });
  });

  describe("POST /cases/:id/recent-history", () => {
    test("should log a case note", async () => {
      const caseNoteAction = await models.case_note_action.create(
        { name: "some action" },
        { auditUser: "some user" }
      );
      const existingCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIncidentLocation(undefined)
        .build();
      const createdCase = await models.cases.create(existingCase, {
        auditUser: "someone"
      });

      const caseNote = {
        caseId: createdCase.dataValues.id,
        caseNoteActionId: caseNoteAction.id,
        caseNoteAction: {
          id: caseNoteAction.id,
          name: caseNoteAction.name
        },
        notes: "some interesting notes....",
        actionTakenAt: new Date().toISOString(),
        mentionedUsers: []
      };

      const numberOfCaseNotesBeforeRequest = await models.case_note.count({
        where: {
          caseId: caseNote.caseId
        }
      });

      const responsePromise = request(app)
        .post(`/api/cases/${createdCase.dataValues.id}/case-notes`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(caseNote);

      await expectResponse(
        responsePromise,
        201,
        expect.objectContaining({
          caseDetails: expect.objectContaining({
            status: CASE_STATUS.ACTIVE
          }),
          caseNotes: expect.arrayContaining([
            expect.objectContaining({
              caseId: caseNote.caseId,
              caseNoteActionId: caseNoteAction.id,
              caseNoteAction: expect.objectContaining({
                id: caseNoteAction.id,
                name: caseNoteAction.name
              }),
              notes: caseNote.notes,
              actionTakenAt: caseNote.actionTakenAt,
              id: expect.anything()
            })
          ])
        })
      );

      const numberOfCaseNotesAfterRequest = await models.case_note.count({
        where: {
          caseId: caseNote.caseId
        }
      });

      const updatedCase = await models.cases.findByPk(createdCase.id);

      expect(numberOfCaseNotesAfterRequest).toEqual(
        numberOfCaseNotesBeforeRequest + 1
      );
      expect(updatedCase.dataValues.status).toEqual(CASE_STATUS.ACTIVE);
    });
  });

  describe("PUT /cases/id/narrative", () => {
    let caseToUpdate;

    beforeEach(async () => {
      let civilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withNoAddress()
        .withFirstName("Eleanor")
        .build();

      let caseToCreate = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withComplainantCivilians([civilian])
        .withNarrativeDetails("Beginning narrative")
        .withIncidentLocation(undefined)
        .build();

      caseToUpdate = await models.cases.create(caseToCreate, {
        returning: true,
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user"
          }
        ],
        auditUser: "someone"
      });
    });

    test("should update case narrative", async () => {
      const updatedNarrative = {
        narrativeDetails: "A very updated case narrative."
      };

      const responsePromise = request(app)
        .put(`/api/cases/${caseToUpdate.id}/narrative`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNarrative);

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          id: caseToUpdate.id,
          complainantCivilians: [
            expect.objectContaining({
              firstName: caseToUpdate.complainantCivilians[0].firstName,
              lastName: caseToUpdate.complainantCivilians[0].lastName,
              email: caseToUpdate.complainantCivilians[0].email
            })
          ],
          complaintType: caseToUpdate.complaintType,
          narrativeDetails: updatedNarrative.narrativeDetails,
          status: CASE_STATUS.ACTIVE
        })
      );
    });
  });

  describe("attachment routes", () => {
    let defaultCase, defaultCivilian, defaultAttachment, attachmentToDelete;

    beforeEach(async () => {
      defaultCivilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withNoAddress()
        .build();
      defaultAttachment = new Attachment.Builder()
        .defaultAttachment()
        .withId(undefined)
        .withCaseId(undefined);
      attachmentToDelete = new Attachment.Builder()
        .defaultAttachment()
        .withId(undefined)
        .withCaseId(undefined)
        .withFileName("test_file_two.pdf");

      defaultCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withComplainantCivilians([defaultCivilian])
        .withAttachments([defaultAttachment, attachmentToDelete])
        .withIncidentLocation(undefined)
        .build();
      defaultCase = await models.cases.create(defaultCase, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "test user"
          },
          { model: models.attachment, auditUser: "someone" }
        ],
        auditUser: "someone"
      });
    });

    describe("POST /cases/:id/attachments", () => {
      test("should return updated case after adding attachment", async () => {
        let mockKey = `${defaultCase.id}/mock_filename`;

        AWS.S3.mockImplementation(() => {
          return {
            upload: (params, options) => ({
              promise: () => Promise.resolve({ Key: mockKey }),
              abort: () => ({})
            }),
            config: {
              loadFromPath: jest.fn(),
              update: jest.fn()
            }
          };
        });

        const responsePromise = request(app)
          .post(`/api/cases/${defaultCase.id}/attachments`)
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .field("description", "this is a description")
          .attach("avatar", __dirname + "/../../README.md");

        await expectResponse(
          responsePromise,
          200,
          expect.objectContaining({
            id: defaultCase.id,
            complainantCivilians: [
              expect.objectContaining({
                id: defaultCase.complainantCivilians[0].id
              })
            ],
            attachments: expect.arrayContaining([
              expect.objectContaining({ fileName: "README.md" })
            ]),
            status: CASE_STATUS.ACTIVE
          })
        );
      });

      test("should get bad request when case is archived", async () => {
        await defaultCase.destroy({ auditUser: "test" });
        let mockKey = `${defaultCase.id}/mock_filename`;

        AWS.S3.mockImplementation(() => {
          return {
            upload: (params, options) => ({
              promise: () => Promise.resolve({ Key: mockKey }),
              abort: () => ({})
            }),
            config: {
              loadFromPath: jest.fn(),
              update: jest.fn()
            }
          };
        });

        const responsePromise = request(app)
          .post(`/api/cases/${defaultCase.id}/attachments`)
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .field("description", "this is a description")
          .attach("avatar", __dirname + "/../../README.md");

        await expectResponse(responsePromise, 400);
      });

      test("should return 409 when file is a duplicate", async () => {
        let mockFileName = "test_file.pdf";

        AWS.S3.mockImplementation(() => {
          return {
            upload: (params, options) => ({
              promise: () => Promise.resolve({ Key: mockFileName }),
              abort: () => ({})
            }),
            config: {
              loadFromPath: jest.fn(),
              update: jest.fn()
            }
          };
        });

        const responsePromise = request(app)
          .post(`/api/cases/${defaultCase.id}/attachments`)
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .attach(mockFileName, __dirname + "/testFixtures/test_file.pdf");

        await expectResponse(responsePromise, 409);
      });
    });

    describe("DELETE /cases/:id/attachments", () => {
      let caseWithSameFilename;

      test("should delete attachment from case", async () => {
        caseWithSameFilename = new Case.Builder()
          .defaultCase()
          .withId(undefined)
          .withAttachments([defaultAttachment, attachmentToDelete])
          .withIncidentLocation(undefined)
          .build();

        caseWithSameFilename = await models.cases.create(caseWithSameFilename, {
          include: [{ model: models.attachment, auditUser: "someone" }],
          auditUser: "someone"
        });

        AWS.S3.mockImplementation(() => {
          return {
            deleteObject: (_params, options) => ({
              promise: () => Promise.resolve({})
            }),
            config: {
              loadFromPath: jest.fn(),
              update: jest.fn()
            }
          };
        });

        const responsePromise = request(app)
          .delete(
            `/api/cases/${defaultCase.id}/attachments?fileName=${attachmentToDelete.fileName}`
          )
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data");

        await expectResponse(
          responsePromise,
          200,
          expect.objectContaining({
            attachments: [
              expect.objectContaining({ fileName: defaultAttachment.fileName })
            ]
          })
        );

        const attachmentsFromUnmodifiedCase = await models.attachment.findAll({
          where: {
            caseId: caseWithSameFilename.id
          }
        });

        expect(attachmentsFromUnmodifiedCase.length).toEqual(2);
      });
    });
  });

  test("should respond with 503 when app is shutting down", async () => {
    app.locals.shuttingDown = true;

    const responsePromise = request(app)
      .get(`/api/cases/`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data");

    await expectResponse(responsePromise, 503);

    app.locals.shuttingDown = false;
  });
});
