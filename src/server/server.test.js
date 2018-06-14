import app from "./server";
import request from "supertest";
import ms from "smtp-tester";
import models from "./models";
import { AuthenticationClient } from "auth0";
import Civilian from "../client/testUtilities/civilian";
import Case from "../client/testUtilities/case";
import Attachment from "../client/testUtilities/attachment";
import { civilianWithAddress } from "../client/testUtilities/ObjectMothers";
import Address from "../client/testUtilities/Address";
import { EXPORT_AUDIT_LOG } from "../sharedUtilities/constants";
import AWS from "aws-sdk";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "./requestTestHelpers";
import winston from "winston";

jest.mock("auth0", () => ({
  AuthenticationClient: jest.fn()
}));

jest.mock("aws-sdk", () => ({
  S3: jest.fn()
}));

describe("server", () => {
  let token, user;

  beforeEach(async () => {
    user = "some_nickname";
    token = buildTokenWithPermissions("", user);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /health-check", () => {
    test("should show healthy if db connection works", async () => {
      await request(app)
        .get("/health-check")
        .expect(200);
    });
  });

  describe("token check", () => {
    beforeEach(() => {
      winston.remove(winston.transports.Console);
    });

    afterEach(() => {
      winston.add(winston.transports.Console, {
        json: true,
        colorize: true
      });
    });

    test("should return 401 with invalid token", async () => {
      await request(app)
        .get("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer INVALID_KEY`)
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({
            error: "Unauthorized",
            message: "Invalid token",
            statusCode: 401
          });
        });
    });

    test("should return 401 without authorization header", async () => {
      await request(app)
        .get("/api/cases")
        .set("Content-Header", "application/json")
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({
            error: "Unauthorized",
            message: "Invalid token",
            statusCode: 401
          });
        });
    });

    test("should return 401 when nickname missing", async () => {
      token = buildTokenWithPermissions();

      await request(app)
        .post("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(401)
        .then(response => {
          expect(response.body).toEqual({
            error: "Unauthorized",
            message: "User nickname missing",
            statusCode: 401
          });
        });
    });
  });

  describe("POST /audit", () => {
    const mockLog = "Logged Out";
    test("should audit log out", async () => {
      await request(app)
        .post("/api/audit")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ log: mockLog })
        .expect(201);

      const log = await models.action_audit.findAll({
        where: {
          action: mockLog
        }
      });
      expect(log.length).toEqual(1);
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
          complainantType: "Civilian"
        }
      };
    });

    test("should create and edit a case", async () => {
      let createdCaseId;
      const caseRequest = request(app);

      await caseRequest
        .post("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .then(response => {
          responseBody = response.body;
          createdCaseId = response.body.id;

          expect(response.body).toEqual(
            expect.objectContaining({
              ...requestBody.case,
              createdBy: user,
              assignedTo: user,
              complainantCivilians: expect.arrayContaining([
                expect.objectContaining(requestBody.civilian)
              ])
            })
          );
        });

      const editBody = {
        firstContactDate: "2018-04-27",
        incidentTime: "16:00:00",
        incidentDate: "2018-03-18",
        incidentLocation: new Address.Builder()
          .defaultAddress()
          .withId(undefined)
          .withAddressableId(undefined)
          .withAddressableType("cases")
          .withStreetAddress("123 fleet street")
          .build()
      };

      await caseRequest
        .put(`/api/cases/${createdCaseId}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(editBody)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: createdCaseId,
              ...editBody,
              incidentLocation: expect.objectContaining({
                streetAddress: "123 fleet street",
                addressableId: createdCaseId,
                addressableType: "cases"
              }),
              complainantCivilians: expect.arrayContaining([
                expect.objectContaining(requestBody.civilian)
              ])
            })
          );
        });
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
        .withAddressableType("civilian")
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
        .build();

      await request(app)
        .post(`/api/civilian`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(newCivilian)
        .expect(201)
        .then(response => {
          const caseDetails = response.body;

          expect(caseDetails).toEqual(
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
                    addressableType: "civilian"
                  })
                })
              ])
            })
          );
        });
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
        .withAddressableType("civilian")
        .build();
      await seededCivilian.createAddress(address, { auditUser: "someone" });
    });

    test("should update an existing civilian", async () => {
      const updatedCivilian = {
        firstName: "BOBBY",
        lastName: "FISHHERRR"
      };
      await request(app)
        .put(`/api/civilian/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian)
        .expect(200)
        .then(response => {
          const caseDetails = response.body;

          expect(caseDetails).toEqual(
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
    });

    test("should save new address if it doesnt exist yet", async () => {
      const updatedCivilian = {
        id: seededCivilian.id,
        address: {
          state: "IL"
        }
      };
      await request(app)
        .put(`/api/civilian/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian)
        .expect(200)
        .then(response => {
          const caseDetails = response.body;

          expect(caseDetails).toEqual(
            expect.objectContaining({
              complainantCivilians: expect.arrayContaining([
                expect.objectContaining({
                  address: expect.objectContaining({
                    state: updatedCivilian.address.state,
                    addressableType: "civilian"
                  })
                })
              ])
            })
          );
        });
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
        .withAddressableType("civilian")
        .withAddressableId(civilianToUpdate.id)
        .build();

      await civilianToUpdate.createAddress(address, { auditUser: "someone" });
      await civilianToUpdate.reload({ include: [models.address] });

      await request(app)
        .put(`/api/civilian/${civilianToUpdate.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: civilianToUpdate.id,
          address: {
            id: civilianToUpdate.address.id,
            city: "New Orleans"
          }
        })
        .expect(200)
        .then(response => {
          const caseDetails = response.body;

          expect(caseDetails).toEqual(
            expect.objectContaining({
              complainantCivilians: expect.arrayContaining([
                expect.objectContaining({
                  address: expect.objectContaining({
                    city: "New Orleans"
                  })
                })
              ])
            })
          );
        });
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
            auditUser: "test user"
          }
        ],
        auditUser: "someone"
      });

      let civilianToUpdate = caseToUpdate.dataValues.complainantCivilians[0];
      const address = new Address.Builder()
        .defaultAddress()
        .withId(undefined)
        .withAddressableType("civilian")
        .withAddressableId(civilianToUpdate.id)
        .build();
      await civilianToUpdate.createAddress(address, { auditUser: "someone" });
      await civilianToUpdate.reload({ include: [models.address] });

      await request(app)
        .put(`/api/civilian/${civilianToUpdate.id}`)
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
        })
        .then(response => {
          const caseDetails = response.body;

          expect(caseDetails).toEqual(
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
    });

    test("should update the case status to active when an associated civilian has been updated ", async () => {
      const updatedCivilian = {
        firstName: "BOBBY"
      };
      await request(app)
        .put(`/api/civilian/${seededCivilian.id}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedCivilian)
        .expect(200)
        .then(response => {
          expect(response.body.status).toEqual("Active");
        });
    });
  });

  describe("POST /users", () => {
    let mailServer;
    beforeEach(() => {
      mailServer = ms.init(2525);
    });
    afterEach(async () => {
      await models.users.destroy({
        truncate: true
      });
      mailServer.stop();
    });

    test("should create a user", async () => {
      mailServer.bind(
        "rswanson@pawnee.gov",
        (destinationAddress, id, email) => {
          expect(destinationAddress).toEqual("rswanson@pawnee.gov");
        }
      );

      await request(app)
        .post("/api/users")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Ron",
          lastName: "Swanson",
          email: "rswanson@pawnee.gov"
        })
        .expect(201)
        .then(response => {
          expect(response.body.id).not.toBeUndefined();
          expect(response.body.firstName).toEqual("Ron");
          expect(response.body.lastName).toEqual("Swanson");
          expect(response.body.email).toEqual("rswanson@pawnee.gov");
          expect(response.body.createdAt).not.toBeUndefined();
          expect(response.body.password).toBeUndefined();
        });
    });
  });

  describe("GET /users", () => {
    let seededUsers;

    beforeEach(async () => {
      seededUsers = await models.users.bulkCreate(
        [
          {
            firstName: "Carlman",
            lastName: "Domen",
            email: "cdomen@gmail.com",
            password: "password123"
          },
          {
            firstName: "Ellery",
            lastName: "Salome",
            email: "esalome@gmail.com",
            password: "password123"
          }
        ],
        {
          returning: true
        }
      );
    });

    afterEach(async () => {
      await models.users.destroy({
        truncate: true
      });
    });

    test("should get all users", async () => {
      await request(app)
        .get("/api/users")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body.users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                firstName: seededUsers[0].firstName,
                lastName: seededUsers[0].lastName,
                email: seededUsers[0].email,
                createdAt: seededUsers[0].createdAt.toISOString()
              }),
              expect.objectContaining({
                firstName: seededUsers[1].firstName,
                lastName: seededUsers[1].lastName,
                email: seededUsers[1].email,
                createdAt: seededUsers[1].createdAt.toISOString()
              })
            ])
          );
        });
    });
  });

  describe("GET /cases/:id/recent-activity", () => {
    let createdCase;
    beforeEach(async () => {
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
          action: "Miscellaneous",
          user: "tuser",
          actionTakenAt: new Date().toISOString(),
          notes: "some notes"
        },
        { auditUser: "someone" }
      );
    });

    test("should display recent activity for an existing case", async () => {
      await request(app)
        .get(`/api/cases/${createdCase.dataValues.id}/recent-activity`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                caseId: createdCase.id,
                action: "Miscellaneous",
                user: "tuser",
                notes: "some notes"
              })
            ])
          );
        });
    });
  });

  describe("POST /cases/:id/recent-history", () => {
    test("should log a case note", async () => {
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
        action: "Miscellaneous",
        notes: "some interesting notes....",
        actionTakenAt: new Date().toISOString()
      };

      const numberOfCaseNotesBeforeRequest = await models.case_note.count({
        where: {
          caseId: caseNote.caseId
        }
      });

      await request(app)
        .post(`/api/cases/${createdCase.dataValues.id}/recent-activity`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(caseNote)
        .expect(201)
        .then(response => {
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                caseId: caseNote.caseId,
                action: caseNote.action,
                notes: caseNote.notes,
                actionTakenAt: caseNote.actionTakenAt,
                id: expect.anything()
              })
            ])
          );
        });

      const numberOfCaseNotesAfterRequest = await models.case_note.count({
        where: {
          caseId: caseNote.caseId
        }
      });

      const updatedCase = await models.cases.findById(createdCase.id);

      expect(numberOfCaseNotesAfterRequest).toEqual(
        numberOfCaseNotesBeforeRequest + 1
      );
      expect(updatedCase.dataValues.status).toEqual("Active");
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

      await request(app)
        .put(`/api/cases/${caseToUpdate.id}/narrative`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNarrative)
        .expect(200)
        .then(response => {
          expect(response.body.id).toEqual(caseToUpdate.id);
          expect(response.body.complainantCivilians[0].firstName).toEqual(
            caseToUpdate.complainantCivilians[0].firstName
          );
          expect(response.body.complainantCivilians[0].lastName).toEqual(
            caseToUpdate.complainantCivilians[0].lastName
          );
          expect(response.body.complainantCivilians[0].email).toEqual(
            caseToUpdate.complainantCivilians[0].email
          );
          expect(response.body.complainantType).toEqual(
            caseToUpdate.complainantType
          );
          expect(response.body.narrativeDetails).toEqual(
            updatedNarrative.narrativeDetails
          );
          expect(response.body.status).toEqual("Active");
        });
    });
  });

  describe("GET /api/export-audit-log", () => {
    let testCase;
    const testCreationDate = new Date("2018-01-31T19:00:22Z");
    const testCreationDateTwo = new Date("2018-01-28T19:00:50Z");
    beforeEach(async () => {
      testCase = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withIncidentLocation(undefined)
          .withId(undefined)
          .build(),
        { auditUser: "someone" }
      );
      await models.action_audit.create({
        user: "tuser",
        action: "Test action entered",
        caseId: testCase.id,
        createdAt: testCreationDate
      });

      await models.action_audit.create({
        user: "tuser",
        action: "Test action entered",
        caseId: testCase.id,
        createdAt: testCreationDateTwo
      });
    });

    test("should return audit log csv when user has token with export permissions", async () => {
      const tokenWithExportPermission = buildTokenWithPermissions(
        EXPORT_AUDIT_LOG,
        "nickname"
      );
      await request(app)
        .get("/api/export-audit-log")
        .set("Authorization", `Bearer ${tokenWithExportPermission}`)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual(
            expect.stringContaining(
              `Date,Case #,Event,User\n01/28/2018 13:00:50 CST,${
                testCase.id
              },Test action entered,tuser\n01/31/2018 13:00:22 CST,${
                testCase.id
              },Test action entered,tuser\n`
            )
          );
        });
    });

    test("should return 401 when user has token without export permissions", async () => {
      await request(app)
        .get("/api/export-audit-log")
        .set("Authorization", `Bearer ${token}`)
        .expect(401);
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
              promise: () => Promise.resolve({ Key: mockKey })
            }),
            config: {
              loadFromPath: jest.fn()
            }
          };
        });

        await request(app)
          .post(`/api/cases/${defaultCase.id}/attachments`)
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .field("description", "this is a description")
          .attach("avatar", __dirname + "/../../README.md")
          .expect(200)
          .then(response => {
            expect(response.body.id).toEqual(defaultCase.id);
            expect(response.body.complainantCivilians[0].id).toEqual(
              defaultCase.complainantCivilians[0].id
            );
            expect(response.body.attachments).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ fileName: "README.md" })
              ])
            );
            expect(response.body.status).toEqual("Active");
          });
      });

      test("should return 409 when file is a duplicate", async () => {
        let mockFileName = "test_file.pdf";

        AWS.S3.mockImplementation(() => {
          return {
            upload: (params, options) => ({
              promise: () => Promise.resolve({ Key: mockFileName })
            }),
            config: {
              loadFromPath: jest.fn()
            }
          };
        });

        await request(app)
          .post(`/api/cases/${defaultCase.id}/attachments`)
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .attach(mockFileName, __dirname + "/testFixtures/test_file.pdf")
          .expect(409);
      });
    });

    describe("DELETE /cases/:id/attachments/:fileName", () => {
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
              loadFromPath: jest.fn()
            }
          };
        });

        await request(app)
          .delete(
            `/api/cases/${defaultCase.id}/attachments/${
              attachmentToDelete.fileName
            }`
          )
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "multipart/form-data")
          .expect(200)
          .then(response => {
            expect(response.body.attachments.length).toEqual(1);
            expect(response.body.attachments[0].fileName).toEqual(
              defaultAttachment.fileName
            );
          });

        const attachmentsFromUnmodifiedCase = await models.attachment.findAll({
          where: {
            caseId: caseWithSameFilename.id
          }
        });

        expect(attachmentsFromUnmodifiedCase.length).toEqual(2);
      });
    });
  });
});
