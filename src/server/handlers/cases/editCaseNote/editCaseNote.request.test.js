import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import CaseNote from "../../../../client/testUtilities/caseNote";
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
    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("tuser")
      .withAction("Memo to file")
      .withNotes("default notes")
      .withCaseId(createdCase.id)
      .build();

    const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });
    const updatedCaseNote = {
      action: "Miscellaneous",
      notes: "updated notes"
    };

    const responsePromise = request(app)
      .put(`/api/cases/${createdCase.id}/case-notes/${createdCaseNote.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedCaseNote);

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
