import models from "../../../models/index";
import app from "../../../server";
import request from "supertest";
import Case from "../../../../client/testUtilities/case";
import CaseNote from "../../../../client/testUtilities/caseNote";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

jest.mock("../export/jobQueue");

describe("removeCaseNote request", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should remove a case note", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
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

    await request(app)
      .delete(`/api/cases/${createdCase.id}/case-notes/${createdCaseNote.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const currentCase = response.body;

        expect(currentCase).toEqual(
          expect.objectContaining({
            caseNotes: [],
            caseDetails: expect.objectContaining({
              id: createdCase.id,
              status: CASE_STATUS.ACTIVE
            })
          })
        );
      });
  });
});
