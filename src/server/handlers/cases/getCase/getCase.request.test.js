import request from "supertest";
import app from "../../../server";
import Attachment from "../../../../sharedTestHelpers/attachment";
import models from "../../../policeDataManager/models";
import Civilian from "../../../../sharedTestHelpers/civilian";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Case from "../../../../sharedTestHelpers/case";
import Address from "../../../../sharedTestHelpers/Address";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  CIVILIAN_INITIATED,
  WITNESS
} from "../../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";

jest.mock(
  "../../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("GET /cases/:id", () => {
  let caseToRetrieve,
    incidentLocation,
    expectedStreetAddress,
    complaintType,
    token;

  beforeEach(async () => {
    await cleanupDatabase();
    token = buildTokenWithPermissions("", "some_nickname");

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    complaintType = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });

    const supervisor = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withEmployeeId(123)
      .build();
    const createdSupervisor = await models.officer.create(supervisor);

    const officer = new Officer.Builder()
      .defaultOfficer()
      .withEmployeeId(567)
      .withSupervisor(createdSupervisor)
      .withId(undefined)
      .build();
    const createdOfficer = await models.officer.create(officer);

    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(createdOfficer)
      .withSupervisor(createdSupervisor)
      .withId(undefined)
      .build();

    let attachment = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(undefined)
      .build();

    let civilian = new Civilian.Builder()
      .defaultCivilian()
      .withNoAddress()
      .withId(undefined)
      .withFirstName("Eleanor")
      .build();

    let witness = new Civilian.Builder()
      .defaultCivilian()
      .withNoAddress()
      .withId(undefined)
      .withFirstName("John Witness")
      .withRoleOnCase(WITNESS)
      .build();

    expectedStreetAddress = "1234 flower ave";
    incidentLocation = new Address.Builder()
      .defaultAddress()
      .withStreetAddress(expectedStreetAddress)
      .withId(undefined)
      .withAddressableId(undefined)
      .withAddressableType(ADDRESSABLE_TYPE.CASES)
      .build();

    let caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([civilian])
      .withComplaintTypeId(complaintType.id)
      .withWitnessCivilians([witness])
      .withAttachments([attachment])
      .withIncidentLocation(incidentLocation)
      .withAccusedOfficers([accusedOfficer])
      .build();

    caseToRetrieve = await models.cases.create(caseToCreate, {
      returning: true,
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone else"
        },
        {
          model: models.civilian,
          as: "witnessCivilians",
          auditUser: "someone else"
        },
        {
          model: models.attachment,
          auditUser: "someone else"
        },
        {
          model: models.address,
          as: "incidentLocation",
          auditUser: "someone else"
        },
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should get case", async () => {
    const responsePromise = request(app)
      .get(`/api/cases/${caseToRetrieve.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        id: caseToRetrieve.id,
        complaintType: complaintType.name,
        status: "Initial",
        complainantCivilians: expect.arrayContaining([
          expect.objectContaining({
            firstName: caseToRetrieve.complainantCivilians[0].firstName,
            lastName: caseToRetrieve.complainantCivilians[0].lastName,
            email: caseToRetrieve.complainantCivilians[0].email
          })
        ]),
        witnessCivilians: expect.arrayContaining([
          expect.objectContaining({
            firstName: caseToRetrieve.witnessCivilians[0].firstName,
            lastName: caseToRetrieve.witnessCivilians[0].lastName,
            email: caseToRetrieve.witnessCivilians[0].email
          })
        ]),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            id: caseToRetrieve.attachments[0].id,
            caseId: caseToRetrieve.attachments[0].caseId,
            fileName: caseToRetrieve.attachments[0].fileName
          })
        ]),
        incidentLocation: expect.objectContaining({
          streetAddress: expectedStreetAddress,
          id: caseToRetrieve.incidentLocation.id
        }),
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            officerId: caseToRetrieve.accusedOfficers[0].officerId,
            employeeType: caseToRetrieve.accusedOfficers[0].employeeType,
            supervisorFullName:
              caseToRetrieve.accusedOfficers[0].supervisorFullName,
            roleOnCase: ACCUSED
          })
        ])
      })
    );
  });
});
