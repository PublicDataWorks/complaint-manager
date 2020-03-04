import models from "../../../complaintManager/models";
import Case from "../../../../client/complaintManager/testUtilities/case";
import CaseNote from "../../../../client/complaintManager/testUtilities/caseNote";
import request from "supertest";
import app from "../../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";

jest.mock("../export/jobQueue");

describe("editCaseNote request", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should edit a case note", async () => {
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
    const caseNoteAction = await models.case_note_action.create(
      {
        name: "Memo to file"
      },
      { auditUser: "testuser" }
    );
    const newCaseNoteAction = await models.case_note_action.create(
      {
        name: "Miscellaneous"
      },
      { auditUser: "testuser" }
    );
    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("tuser")
      .withCaseNoteActionId(caseNoteAction.id)
      .withNotes("default notes")
      .withCaseId(createdCase.id)
      .build();

    const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    const updatedCaseNote = {
      caseNoteActionId: newCaseNoteAction.id,
      notes: "updated notes"
    };

    const responsePromise = request(app)
      .put(`/api/cases/${createdCase.id}/case-notes/${createdCaseNote.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...updatedCaseNote, mentionedUsers: [] });

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        expect.objectContaining({
          ...updatedCaseNote,
          id: createdCaseNote.id,
          user: "tuser"
        })
      ])
    );
  });
});
