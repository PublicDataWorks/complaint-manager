import * as httpMocks from "node-mocks-http";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import CaseNote from "../../../../client/testUtilities/caseNote";
import removeCaseNote from "./removeCaseNote";
import { cleanupDatabase } from "../../../requestTestHelpers";

describe("RemoveCaseNote unit", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should update case status and recent activity in the db after case note removed", async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus("Initial")
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(createdCase.id)
      .build();

    const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    await removeCaseNote(request, response, jest.fn());

    const updatedCase = await models.cases.findAll({
      where: { id: createdCase.id }
    });

    expect(updatedCase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "Active"
        })
      ])
    );

    const updatedRecentActivity = await models.case_note.findAll({
      where: { caseId: updatedCase.id }
    });
    expect(updatedRecentActivity).toEqual([]);
  });
});
