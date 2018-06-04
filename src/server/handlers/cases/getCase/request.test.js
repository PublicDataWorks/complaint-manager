import request from "supertest";
import app from "../../../server";
import Attachment from "../../../../client/testUtilities/attachment";
import models from "../../../models";
import Civilian from "../../../../client/testUtilities/civilian";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";
import Address from "../../../../client/testUtilities/Address";
import buildTokenWithPermissions from "../../../requestTestHelpers";

describe("GET /cases/:id", () => {
  let caseToRetrieve, incidentLocation, expectedStreetAddress, token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
    const supervisor = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(123)
      .build();
    const createdSupervisor = await models.officer.create(supervisor);

    const officer = new Officer.Builder()
      .defaultOfficer()
      .withOfficerNumber(567)
      .withSupervisor(createdSupervisor)
      .withId(undefined)
      .build();
    const createdOfficer = await models.officer.create(officer);

    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficer(createdOfficer)
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

    expectedStreetAddress = "1234 flower ave";
    incidentLocation = new Address.Builder()
      .defaultAddress()
      .withStreetAddress(expectedStreetAddress)
      .withId(undefined)
      .build();
    let caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([civilian])
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
          as: "incidentLocation"
        },
        {
          model: models.case_officer,
          as: "accusedOfficers"
        }
      ],
      auditUser: "someone"
    });
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
      force: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate();
  });

  test("should get case", async () => {
    await request(app)
      .get(`/api/cases/${caseToRetrieve.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: caseToRetrieve.id,
            complainantType: caseToRetrieve.complainantType,
            status: caseToRetrieve.status,
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
              id: caseToRetrieve.incidentLocationId
            }),
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                officerId: caseToRetrieve.accusedOfficers[0].officerId,
                employeeType: caseToRetrieve.accusedOfficers[0].employeeType,
                supervisorFullName:
                  caseToRetrieve.accusedOfficers[0].supervisorFullName,
                roleOnCase: "Accused"
              })
            ])
          })
        );
      });
  });
});
