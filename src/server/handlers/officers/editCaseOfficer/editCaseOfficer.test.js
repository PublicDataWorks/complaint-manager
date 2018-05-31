import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import httpMocks from "node-mocks-http";
import editCaseOfficer from "./editCaseOfficer";

describe("editCaseOfficer", () => {
  afterEach(async () => {
    await models.address.destroy({ truncate: true, cascade: true });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.data_change_audit.truncate();
  });

  test("it persists the updated case officer", async () => {
    const existingOfficer = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(200)
      .build();
    const existingCaseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficer(existingOfficer)
      .build();
    const existingCase = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withAccusedOfficers([existingCaseOfficer])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(existingCase, {
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          include: [models.officer]
        }
      ],
      auditUser: "someone",
      returning: true
    });

    const newOfficer = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(201)
      .build();
    const createdNewOfficer = await models.officer.create(newOfficer, {
      returning: true
    });
    const fieldsToUpdate = { officerId: createdNewOfficer.id };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: fieldsToUpdate,
      params: {
        caseId: createdCase.id,
        caseOfficerId: createdCase.accusedOfficers[0].id
      },
      nickname: null
    });
    const response = httpMocks.createResponse();

    await editCaseOfficer(request, response, jest.fn());

    const updatedCaseOfficer = await models.case_officer.findById(
      createdCase.accusedOfficers[0].id
    );

    expect(updatedCaseOfficer.officerId).toEqual(createdNewOfficer.id);
  });
});
